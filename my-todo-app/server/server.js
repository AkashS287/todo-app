// server/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import taskRoutes from "./routes/task.js";
import authRoutes from "./routes/auth.js";
import sharedRoutes from './routes/shared.js';



dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/shared', sharedRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend is live! Welcome to the Todo API.");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("✅ Server started on port 5000");
    });
  })
  .catch(err => console.log("❌ DB Error:", err.message));
