import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

// Rate limiting store (in-memory for each function instance)
const emailSignupAttempts = new Map();
const MAX_SIGNUP_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Helper function to check rate limiting
const checkRateLimit = (ip) => {
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
const validateEmailSignup = (data) => {
  const errors = [];

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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Supabase is configured
  if (!supabase) {
    return res.status(503).json({
      error: "Email signup service is currently unavailable. Supabase not configured."
    });
  }

  // Get client IP for rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';

  // Check rate limiting
  const rateLimitCheck = checkRateLimit(clientIP);
  if (!rateLimitCheck.allowed) {
    const resetTime = rateLimitCheck.resetTime || Date.now();
    const minutesUntilReset = Math.ceil((resetTime - Date.now()) / (1000 * 60));
    return res.status(429).json({
      error: `Too many signup attempts. Please try again in ${minutesUntilReset} minutes. This helps avoid bot attacks.`
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

  } catch (error) {
    console.error("Email signup error:", error);
    return res.status(500).json({
      error: "An error occurred while processing your signup. Please try again."
    });
  }
}