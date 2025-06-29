import express from "express";
import { loginWithOAuth, getCurrentUser } from "../controllers/authController.js";

const router = express.Router();

// Route for logging in
router.post("/oauth", loginWithOAuth);

// Route for getting current user
router.get("/user", getCurrentUser);

// Optional logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

// ✅ This is the key line to fix your error:
export default router;
