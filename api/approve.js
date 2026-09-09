export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { paymentId, action } = req.body;
  const API_KEY = "vfpniyhv8djjp1udbhoblrdobvmxaj"; 

  if (!paymentId) return res.status(400).json({ error: 'Missing paymentId' });

  const endpoint = action === 'complete' ? 'complete' : 'approve';

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
