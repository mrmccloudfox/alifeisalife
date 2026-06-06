import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

// DISABLED: Admin endpoint removed for security - contains sensitive personal information
export default async function handler(req, res) {
  return res.status(404).json({ error: "Endpoint disabled for security" });
}

/*
// ORIGINAL FUNCTION COMMENTED OUT FOR SECURITY
export default async function handler_DISABLED(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if Supabase is configured
  if (!supabase) {
    return res.status(503).json({
      error: "Email signup service is currently unavailable. Supabase not configured."
    });
  }

  if (req.method === 'GET') {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(10, parseInt(req.query.limit) || 50));
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

    } catch (error) {
      console.error("Admin signups fetch error:", error);
      return res.status(500).json({
        error: "Failed to retrieve email signups."
      });
    }
  }

  if (req.method === 'DELETE') {
    // Handle DELETE /api/admin/signups/[id]
    const id = req.query.id;

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

  return res.status(405).json({ error: 'Method not allowed' });
}
*/