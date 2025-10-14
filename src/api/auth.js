// src/api/auth.js
import axios from "axios";

const getApiBase = () => {
  // First: env variable (set this in frontend/.env for Render)
  if (process.env.REACT_APP_BACKEND_URL) {
    // ensure no trailing slash
    return process.env.REACT_APP_BACKEND_URL.replace(/\/+$/, "");
  }

  // Second: if running locally (dev)
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5001"; // <-- change if your backend uses other local port
  }

  // Fallback: use same origin (useful if backend is proxied)
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ? ":" + window.location.port : ""}`;
  }

  return "http://localhost:5001";
};

export const API_BASE = getApiBase();
console.log("🌍 API_BASE:", API_BASE); // dev debug: confirm value in browser console

// Wrapper helpers
export const signup = async (userData) => {
  const url = `${API_BASE}/api/auth/signup`;
  const res = await axios.post(url, userData);
  return res.data;
};

export const login = async (userData) => {
  const url = `${API_BASE}/api/auth/login`;
  const res = await axios.post(url, userData);
  return res.data;
};

export const getCurrentUser = async (token) => {
  const url = `${API_BASE}/api/auth/me`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
