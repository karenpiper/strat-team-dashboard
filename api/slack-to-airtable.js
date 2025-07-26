export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { text, user, timestamp, channel } = req.body;

    // Format Slack timestamp and permalink
    const tsFormatted = timestamp?.replace('.', '');
    const slackLink = channel && tsFormatted
      ? `https://slack.com/archives/${channel}/p${tsFormatted}`
      : '';

    // Airtable setup
    const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
    const BASE_ID = process.env.AIRTABLE_BASE_ID;
    const TABLE_NAME = 'Posts';

    const airtableURL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

    const airtableRes = await fetch(airtableURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Message: text,
          User: user,
          'Date Added': new Date().toISOString(),
          Link: slackLink
        },
      }),
    });

    const airtableData = await airtableRes.json();

    if (!airtableRes.ok) {
      console.error('Airtable error:', airtableData);
      return res.status(500).json({ error: 'Airtable insertion failed', details: airtableData });
    }

    return res.status(200).json({ success: true, data: airtableData });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
