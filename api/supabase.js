/**
 * /api/supabase.js — Vercel Serverless Function
 *
 * Serves Supabase credentials to the frontend from server-side env vars.
 * Includes proper CORS headers so mobile browsers can fetch this endpoint.
 */

export default function handler(req, res) {
  // ── CORS headers — required for mobile browsers ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(500).json({
      error: 'Server configuration error: Supabase credentials not set.',
      hint: 'Add SUPABASE_URL and SUPABASE_ANON_KEY to your Vercel environment variables.'
    });
  }

  if (!url.includes('.supabase.co') && !url.includes('.supabase.in')) {
    return res.status(500).json({
      error: 'SUPABASE_URL does not look like a valid Supabase project URL.'
    });
  }

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    url: url.trim().replace(/\/$/, ''),
    key: key.trim()
  });
}
