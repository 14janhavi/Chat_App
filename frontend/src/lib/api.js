import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // REQUIRED
});

export const getStreamToken = async () => {
  const res = await API.get("/video/token");
  return res.data;
};

export default API;
