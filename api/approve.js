export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { paymentId } = req.body;
  const API_KEY = "vfpniyhv8djjp1udbhoblrdobvmxaj"; 

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
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
