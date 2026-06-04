import axios from "axios";

const api = axios.create({
  baseURL: "http://88.200.63.148:30029",
});

// Automatically attach token
api.interceptors.request.use((config) => {
  const publicRoutes = ["/login", "/register"];

  if (config.url.startsWith("/login") || config.url.startsWith("/register")) {
  return config;
}


  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
