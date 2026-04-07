export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sender, message } = req.body;
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

  if (!DISCORD_WEBHOOK_URL) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const payload = {
    content: `**[Research Inquiry]**\n**From:** ${sender}\n**Message:** ${message}`
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      throw new Error('Discord response error');
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to transmit message' });
  }
}
