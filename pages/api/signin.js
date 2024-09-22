// pages/api/signin.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { email, password } = req.body;
  
      // Simulate backend validation (replace with actual validation later)
      if (email === 'test@example.com' && password === 'password123') {
        res.status(200).json({ message: 'Sign-in successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  }
  