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

  // ================= AUTH CHECK =================
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

  // ================= SIGNUP =================
  signup: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      // 🔴 SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });
      toast.success("Account created");

      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  },

  // ================= LOGIN =================
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);

      // 🔴 SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });
      toast.success("Logged in");

      get().connectSocket();
    } catch {
      toast.error("Login failed");
    }
  },

  // ================= LOGOUT =================
  logout: async () => {
    localStorage.removeItem("token");
    get().disconnectSocket();
    set({ authUser: null, onlineUsers: [] });
  },

  // ================= SOCKET =================
  connectSocket: () => {
    const token = localStorage.getItem("token");
    const { socket } = get();

    if (!token || socket?.connected) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token }, // ✅ CORRECT
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
