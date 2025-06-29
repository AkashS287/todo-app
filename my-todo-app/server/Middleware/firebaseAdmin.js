// server/Middleware/firebaseAdmin.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.FIREBASE_ADMIN_KEY_BASE64) {
  throw new Error("FIREBASE_ADMIN_KEY_BASE64 is missing in .env");
}

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_KEY_BASE64, 'base64').toString('utf-8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
