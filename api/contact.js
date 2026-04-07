export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sender, email, message, deviceData } = req.body;
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

  // Extract location data from Vercel headers
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
  const city = req.headers['x-vercel-ip-city'] || 'Unknown City';
  const region = req.headers['x-vercel-ip-country-region'] || 'Unknown Region';
  const country = req.headers['x-vercel-ip-country'] || 'Unknown';
  const location = `${city}, ${region}, ${country}`;

  const payload = {
    embeds: [{
      title: "🚀 Detailed Feedback Received",
      color: 0x002147, // Oxford Blue
      fields: [
        {
          name: "👤 Student Info",
          value: `**Name:** ${sender}\n**Email:** ${email}`,
          inline: true
        },
        {
          name: "📍 Location",
          value: `**IP:** ${ip}\n**Place:** ${location}\n**Map:** [Google Maps](https://www.google.com/maps/search/?api=1&query=${city}+${region})`,
          inline: true
        },
        {
          name: "💬 Message",
          value: message
        },
        {
          name: "💻 Device Metadata",
          value: `**Browser/OS:** ${deviceData.ua}\n**Resolution:** ${deviceData.res}\n**Language:** ${deviceData.lang}`
        }
      ],
      footer: {
        text: `Sent via Monowar.me • ${new Date().toLocaleString()}`
      }
    }]
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) return res.status(200).json({ success: true });
    throw new Error();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to transmit' });
  }
}
