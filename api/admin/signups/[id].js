import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Supabase is configured
  if (!supabase) {
    return res.status(503).json({
      error: "Email signup service is currently unavailable. Supabase not configured."
    });
  }

  const { id } = req.query;

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

  } catch (error) {
    console.error("Delete signup error:", error);
    return res.status(500).json({
      error: "Failed to remove email signup."
    });
  }
}