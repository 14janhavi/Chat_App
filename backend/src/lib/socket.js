import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io; // 👈 global io instance
const userSocketMap = {}; // userId -> socketId

export const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://teal-monstera-3c4396.netlify.app",
      ],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;

      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    userSocketMap[socket.userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      delete userSocketMap[socket.userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};

// ✅ EXPORT io instance
export { io };

// ✅ EXPORT helper used by message controller
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
