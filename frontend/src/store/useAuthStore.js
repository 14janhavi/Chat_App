import { create } from "zustand";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://chat-app-pqax.onrender.com";

export const useAuthStore = create((set, get) => ({
  // ================= STATE =================
  authUser: null,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  socket: null,
  onlineUsers: [],

  // ================= CHECK AUTH =================
  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ authUser: res.data.user });

      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ================= SIGNUP =================
  signup: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });

      toast.success("Account Created Successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup Failed"
      );
    }
  },

  // ================= LOGIN =================
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);

      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });

      toast.success("Logged in Successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    }
  },

  // ================= UPDATE PROFILE =================
  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });

      const token = localStorage.getItem("token");

      const res = await axiosInstance.put(
        "/auth/update-profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        authUser: res.data.user,
        isUpdatingProfile: false,
      });

      toast.success("Profile Updated");

      return res.data.user;
    } catch (error) {
      set({ isUpdatingProfile: false });

      toast.error(
        error.response?.data?.message ||
          "Failed to Update Profile"
      );
    }
  },

  // ================= LOGOUT =================
  logout: async () => {
    try {
      localStorage.removeItem("token");

      get().disconnectSocket();

      set({
        authUser: null,
        onlineUsers: [],
      });

      toast.success("Logged Out");
    } catch (error) {
      console.log(error);
    }
  },

  // ================= SOCKET =================
  connectSocket: () => {
    const token = localStorage.getItem("token");

    const { socket } = get();

    if (!token || socket?.connected) return;

    const newSocket = io(SOCKET_URL, {
      auth: {
        token,
      },
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket Connected");
    });

    newSocket.on("getOnlineUsers", (users) => {
      set({
        onlineUsers: users,
      });
    });

    newSocket.on("connect_error", (err) => {
      console.log("Socket Error:", err.message);
    });

    set({
      socket: newSocket,
    });
  },

  // ================= DISCONNECT SOCKET =================
  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.disconnect();
    }

    set({
      socket: null,
      onlineUsers: [],
    });
  },
}));