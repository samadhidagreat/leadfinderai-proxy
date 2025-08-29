export default async function handler(req, res) {
  // ✅ Enable CORS for your domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://leadfinderai.superlativeorganics.shop');
  // Or use '*' for any origin (less secure)
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight (OPTIONS) request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // 🔁 Forward to your Make.com webhook
    const makeWebhookUrl = 'https://hook.us2.make.com/ug6v819x33as3hwv4f17w5s9qgft8v8g';

    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (response.ok) {
      // ✅ Success
      res.status(200).json({ success: true });
    } else {
      // 🚨 Forward the error status
      const errorText = await response.text();
      res.status(response.status).json({
        error: `Make.com error: ${response.status}`,
        details: errorText,
      });
    }
  } catch (err) {
    console.error('Error forwarding request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export config to disable body parsing (optional)
export const config = {
  api: {
    bodyParser: false, // Optional: let JSON parse naturally
  },
};
