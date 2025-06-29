// server/controllers/authController.js
import jwt from 'jsonwebtoken';

export const loginWithOAuth = async (req, res) => {
  const { uid, email, displayName } = req.body;
  const token = jwt.sign({ uid, email, displayName }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
  res
    .cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax'
    })
    .json({ message: 'Login successful' });
};

export const getCurrentUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json(user);
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};