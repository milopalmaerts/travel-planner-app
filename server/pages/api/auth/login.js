import { auth } from '../../../lib/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Firebase authentication
    const user = await auth.getUserByEmail(email);
    
    // In a real app, you would verify the password here
    // For now, we'll just return the user info
    res.status(200).json({
      id: user.uid,
      email: user.email,
      name: user.displayName,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}