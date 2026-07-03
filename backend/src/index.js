
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import videoRoutes from "./routes/video.route.js";

// 🔴 IMPORT FROM SOCKET FILE
import { app, server, setupSocket } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ================= MIDDLEWARE =================
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://teal-monstera-3c4396.netlify.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/video", videoRoutes);

app.get("/api", (req, res) => {
  res.send("API is working ✅");
});



// ================= STATIC (PRODUCTION) =================
app.get("/api", (req, res) => {
  res.send("API is working ✅");
});

// ================= START SERVER =================
const startServer = async () => {
  try {
    await connectDB();

    setupSocket();

    server.listen(PORT, () => {
      console.log(`✅ Server running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();