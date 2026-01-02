import axios from "axios";
const api = axios.create({
  baseURL: "https://chat-app-pqax.onrender.com/api",
  withCredentials: true,
});

export default api;


