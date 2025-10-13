// src/api/auth.js
import axios from "axios";

// 🔹 Auto-detect backend base URL
const API_BASE =
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://si-communication-app.onrender.com");

// ✅ Signup request
export const signup = async (userData) => {
  const response = await axios.post(`${API_BASE}/api/auth/signup`, userData);
  return response.data;
};

// ✅ Login request
export const login = async (userData) => {
  const response = await axios.post(`${API_BASE}/api/auth/login`, userData);
  return response.data;
};

// ✅ Get current user
export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
