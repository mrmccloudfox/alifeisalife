import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Supabase is configured
  if (!supabase) {
    return res.status(503).json({
      error: "Database not configured"
    });
  }

  try {
    // Get total signup count
    const { count, error } = await supabase
      .from('email_signups')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return res.status(200).json({
      total_signups: count || 0,
      message: `There are currently ${count || 0} email signups.`
    });

  } catch (error) {
    console.error("Count fetch error:", error);
    return res.status(500).json({
      error: "Failed to get signup count"
    });
  }
}