// lib/api.js
import axios from "axios";

const API = "https://chat-app-pqax.onrender.com";

export const getStreamToken = async () => {
  const res = await axios.get(`${API}/api/video/token`, {
    withCredentials: true,
  });
  return res.data;
};

