import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://chat-app-pqax.onrender.com";

const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  socket: null,
  onlineUsers: [],

  // 🔐 CHECK AUTH
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch {
      localStorage.removeItem("token");
      set({ authUser: null });
      get().disconnectSocket();
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // 🔐 LOGIN
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      set({ authUser: res.data.user });
      toast.success("Logged in");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  },

  // 🔐 SIGNUP
  signup: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      localStorage.setItem("token", res.data.token);
      set({ authUser: res.data.user });
      toast.success("Account created");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  },

  // 🔐 LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    set({ authUser: null });
    get().disconnectSocket();
    toast.success("Logged out");
  },

  // 🔌 SOCKET
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(SOCKET_URL, {
      query: { userId: authUser._id },
    });

    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));

export default useAuthStore;
