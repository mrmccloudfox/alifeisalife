import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

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
