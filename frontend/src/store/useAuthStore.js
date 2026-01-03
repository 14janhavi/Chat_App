import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://chat-app-pqax.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  onlineUsers: [],

  // ================= LOGIN =================
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);

      // store token
      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  // ================= SIGNUP =================
  signup: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });
      toast.success("Account created");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  },

  // ================= LOGOUT =================
  logout: () => {
    localStorage.removeItem("token");
    get().disconnectSocket();
    set({ authUser: null, onlineUsers: [] });
  },

  // ================= SOCKET =================
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket) return;

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
    set({ socket: null });
  },
}));

export default useAuthStore;
