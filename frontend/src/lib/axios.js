import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chat-app-pqax.onrender.com/api",
  withCredentials: true,
});

