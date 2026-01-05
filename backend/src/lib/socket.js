import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// ================= BASIC SETUP =================
export const app = express();
export const server = http.createServer(app);

// ================= SOCKET STATE =================
export let io = null;               // 👈 initialize explicitly
const userSocketMap = {};           // userId -> socketId
let isSocketInitialized = false;    // 👈 prevents double init

// ================= SOCKET INIT =================
export const setupSocket = () => {
  // 🛑 Prevent initializing socket more than once
  if (isSocketInitialized) return;
  isSocketInitialized = true;

  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://teal-monstera-3c4396.netlify.app",
      ],
      credentials: true,
    },
  });

  // ---------- JWT AUTH ----------
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Unauthorized: Token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;

      next();
    } catch (err) {
      return next(new Error("Unauthorized: Invalid token"));
    }
  });

  // ---------- CONNECTION ----------
  io.on("connection", (socket) => {
    userSocketMap[socket.userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      delete userSocketMap[socket.userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  console.log("✅ Socket.IO initialized");
};

// ================= HELPERS =================
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId] || null;
};
