import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    realtime: {
      transport: WebSocket
    }
  });
} else {
  console.warn("Supabase credentials not found. Email signup features will be disabled.");
}

// Rate limiting store for email signups (in-memory, resets on restart)
const emailSignupAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_SIGNUP_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

// Helper function to check rate limiting
const checkRateLimit = (ip: string): { allowed: boolean; resetTime?: number } => {
  const now = Date.now();
  const attempts = emailSignupAttempts.get(ip);

  if (!attempts) {
    emailSignupAttempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (now > attempts.resetTime) {
    emailSignupAttempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (attempts.count >= MAX_SIGNUP_ATTEMPTS) {
    return { allowed: false, resetTime: attempts.resetTime };
  }

  attempts.count++;
  return { allowed: true };
};

// Helper function to validate email signup data
const validateEmailSignup = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.firstName || typeof data.firstName !== 'string') {
    errors.push("First name is required");
  } else if (data.firstName.length < 2 || data.firstName.length > 50) {
    errors.push("First name must be between 2 and 50 characters");
  } else if (!/^[a-zA-Z\s\-']+$/.test(data.firstName)) {
    errors.push("First name can only contain letters, spaces, hyphens, and apostrophes");
  }

  if (!data.lastName || typeof data.lastName !== 'string') {
    errors.push("Last name is required");
  } else if (data.lastName.length < 2 || data.lastName.length > 50) {
    errors.push("Last name must be between 2 and 50 characters");
  } else if (!/^[a-zA-Z\s\-']+$/.test(data.lastName)) {
    errors.push("Last name can only contain letters, spaces, hyphens, and apostrophes");
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push("Email is required");
  } else if (data.email.length > 254) {
    errors.push("Email address is too long");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please enter a valid email address");
  }

  if (data.agreedToTerms !== true) {
    errors.push("You must agree to the terms and privacy policy");
  }

  return { valid: errors.length === 0, errors };
};

// In-memory store for support messages which resets on restart
const supportMessages = [
  {
    id: "1",
    name: "Sarah Jenkins",
    location: "Colorado Springs, CO",
    message: "Thank you for sharing your beautiful voice. Never let anyone quiet your beliefs!",
    date: "2026-05-27T14:32:00Z"
  },
  {
    id: "2",
    name: "David K.",
    location: "Denver, CO",
    message: "Every life has value, and your poem is a powerful reminder. Keep standing strong!",
    date: "2026-05-28T02:15:00Z"
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    location: "Arvada, CO",
    message: "Hope House Colorado does amazing work, and this t-shirt is a wonderful blessing. Order placed!",
    date: "2026-05-28T04:45:00Z"
  }
];

// Lazy initialization of GoogleGenAI client to avoid crashes if API key is missing
let aiClient: GoogleGenAI | null = null;
function getAi() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. Server AI features will fallback to simulation.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Retrieve safety message count or message lists
app.get("/api/messages", (req, res) => {
  res.json({ messages: supportMessages });
});

// Submit a new support message
app.post("/api/messages", (req, res) => {
  const { name, location, message } = req.body;
  
  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required." });
  }

  const newMessage = {
    id: String(supportMessages.length + 1),
    name: name.trim(),
    location: (location || "Anonymous").trim(),
    message: message.trim(),
    date: new Date().toISOString()
  };

  supportMessages.unshift(newMessage);
  res.status(201).json(newMessage);
});

// Email Signup Endpoints
app.post("/api/email-signup", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({
      error: "Email signup service is currently unavailable. Supabase not configured."
    });
  }

  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

  // Check rate limiting
  const rateLimitCheck = checkRateLimit(clientIP);
  if (!rateLimitCheck.allowed) {
    const resetTime = rateLimitCheck.resetTime || Date.now();
    const minutesUntilReset = Math.ceil((resetTime - Date.now()) / (1000 * 60));
    return res.status(429).json({
      error: `Too many signup attempts. Please try again in ${minutesUntilReset} minutes.`
    });
  }

  // Validate request data
  const validation = validateEmailSignup(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      error: "Validation failed",
      details: validation.errors
    });
  }

  const { firstName, lastName, email, agreedToTerms } = req.body;

  try {
    // Insert into Supabase
    const { data, error } = await supabase
      .from('email_signups')
      .insert([
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          agreed_to_terms: agreedToTerms,
          source: 'newsletter'
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(409).json({
          error: "This email address is already subscribed to our newsletter."
        });
      }
      throw error;
    }

    return res.status(201).json({
      id: data.id,
      message: "Successfully subscribed!",
      email: data.email
    });

  } catch (error: any) {
    console.error("Email signup error:", error);
    return res.status(500).json({
      error: "An error occurred while processing your signup. Please try again."
    });
  }
});

// Admin endpoint to view all email signups
app.get("/api/admin/signups", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({
      error: "Email signup service is currently unavailable. Supabase not configured."
    });
  }

  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(10, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('email_signups')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return res.json({
      signups: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error: any) {
    console.error("Admin signups fetch error:", error);
    return res.status(500).json({
      error: "Failed to retrieve email signups."
    });
  }
});

// Admin endpoint to export signups as CSV
app.get("/api/admin/signups/export", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({
      error: "Email signup service is currently unavailable. Supabase not configured."
    });
  }

  try {
    const { data, error } = await supabase
      .from('email_signups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Generate CSV content
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Agreed to Terms', 'Date Signed Up', 'Source'];
    const csvRows = [headers.join(',')];

    (data || []).forEach(signup => {
      const row = [
        signup.id,
        `"${signup.first_name}"`,
        `"${signup.last_name}"`,
        signup.email,
        signup.agreed_to_terms ? 'Yes' : 'No',
        new Date(signup.created_at).toLocaleDateString(),
        signup.source || 'newsletter'
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const filename = `email-signups-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(csvContent);

  } catch (error: any) {
    console.error("CSV export error:", error);
    return res.status(500).json({
      error: "Failed to export email signups."
    });
  }
});

// Admin endpoint to manually unsubscribe an email
app.delete("/api/admin/signups/:id", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({
      error: "Email signup service is currently unavailable. Supabase not configured."
    });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Signup ID is required." });
  }

  try {
    const { error } = await supabase
      .from('email_signups')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.json({ message: "Email removed successfully" });

  } catch (error: any) {
    console.error("Delete signup error:", error);
    return res.status(500).json({
      error: "Failed to remove email signup."
    });
  }
});

// Real-time TTS Recitation using Google Gemini
app.post("/api/tts", async (req, res) => {
  const { text, voice = "Kore" } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required for recitation." });
  }

  const ai = getAi();
  if (!ai) {
    // Return simulated audio/response indicators or standard web speech synthesis fallback trigger if no API key is set
    return res.json({ 
      simulated: true, 
      message: "No Gemini API key supplied to backend. Recitation will use browser SpeechSynthesis.",
      text 
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say with deep feeling and emotional clarity: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audio: base64Audio });
    } else {
      return res.status(500).json({ error: "Failed to extract audio stream from Gemini response." });
    }
  } catch (error: any) {
    console.error("TTS generation failed:", error);
    return res.status(500).json({ error: error.message || "Internal error generating speech." });
  }
});

// Dynamic AI Response generator helper for Custom Reflections
app.post("/api/reflect", async (req, res) => {
  const { feedback } = req.body;
  if (!feedback) {
    return res.status(400).json({ error: "Feedback statement is required." });
  }

  const ai = getAi();
  if (!ai) {
    // Return simulated response
    return res.json({
      text: `Your reflection on "${feedback}" is truly touching. Thank you for standing in solidarity for life and local community freedom. Together we can lift young voices.`
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `The visitor shared this reflection regarding the teenage mother support t-shirt benefit and advocacy line: "${feedback}". Generate a warm, heartfelt, supportive 2-3 sentence response acknowledging their sentiment with deep gratitude, reflecting on the community's mission at Hope House Colorado. Keep it brief and elegant.`,
    });
    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Reflection generation failed:", error);
    return res.status(500).json({ error: error?.message || "Internal error generating response." });
  }
});

// Setup Vite Dev Server / Static Asset fallbacks
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
