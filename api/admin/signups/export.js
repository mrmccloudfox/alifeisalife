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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Supabase is configured
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

  } catch (error) {
    console.error("CSV export error:", error);
    return res.status(500).json({
      error: "Failed to export email signups."
    });
  }
}
*/