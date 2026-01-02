import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chat-app-pqax.onrender.com/api",
  withCredentials: true,
});

// ✅ ADD THIS FUNCTION
export const getStreamToken = async () => {
  const res = await axiosInstance.get("/video/token");
  return res.data;
};


