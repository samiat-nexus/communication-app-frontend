// src/api/profile.js
import axios from "axios";

// ⚙️ Backend Base URL
const API_BASE =
  (process.env.REACT_APP_BACKEND_URL ||
    "https://si-communication-app.onrender.com").replace(/\/+$/, "");

// === Fetch Profile ===
export async function getProfile() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  try {
    const res = await axios.get(`${API_BASE}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("❌ getProfile error:", err);
    throw err;
  }
}

// === Update Profile ===
export async function updateProfile(data) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  try {
    const res = await axios.put(`${API_BASE}/api/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("❌ updateProfile error:", err);
    throw err;
  }
}
