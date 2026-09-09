export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được phép' });
  }

  const apiKey = "zahgkcepczux7xbvv8qaj0qdww7mgbig2o2tcuqqoyl4ntzmzpkk";
  const { paymentId, action } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'Thiếu paymentId' });
  }

  const endpoint = action === 'complete' 
    ? `https://api.minepi.com/v2/payments/${paymentId}/complete`
    : `https://api.minepi.com/v2/payments/${paymentId}/approve`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
