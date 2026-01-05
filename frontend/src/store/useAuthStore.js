import { create } from "zustand";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://chat-app-pqax.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  socket: null,
  onlineUsers: [],

  // ✅ ONLY API AUTH CHECK (NO SOCKET)
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created");
      get().connectSocket();
    } catch (err) {
      toast.error("Signup failed");
    }
  },

  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in");
      get().connectSocket();
    } catch {
      toast.error("Login failed");
    }
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");
    get().disconnectSocket();
    set({ authUser: null, onlineUsers: [] });
  },

  // ✅ JWT SOCKET AUTH
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: authUser.token, // 🔴 REQUIRED
      },
    });

    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));
