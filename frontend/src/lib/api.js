import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ✅ ADD THIS FUNCTION
export const getStreamToken = async () => {
  const res = await axiosInstance.get("/video/token");
  return res.data;
};


