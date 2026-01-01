// lib/api.js
import axios from "axios";

export const getStreamToken = async () => {
  const res = await axios.get("http://localhost:5001/api/video/token", {
    withCredentials: true,
  });
  return res.data;
};
