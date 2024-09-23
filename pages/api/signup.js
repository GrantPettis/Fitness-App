// pages/api/signup.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Simulate user registration (replace with real database logic)
    if (email === 'existing@example.com') {
      res.status(409).json({ message: 'Email is already registered' });
    } else {
      res.status(201).json({ message: 'Sign-up successful', user: { name, email } });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
