// src/pages/Login.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login, authLoading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    const ok = await login(email, password);
    if (ok) navigate("/dashboard");
    else setLocalError(error || "Login failed");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {(localError || error) && <p style={styles.error}>{localError || error}</p>}
          <button type="submit" style={styles.button} disabled={authLoading}>
            {authLoading ? "Please wait..." : "Login"}
          </button>
        </form>
        <p style={styles.footer}>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #6B73FF, #000DFF)" },
  card: { width: "350px", padding: "40px", borderRadius: "16px", background: "#fff", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  title: { fontSize: "1.8rem", marginBottom: "25px", color: "#111" },
  input: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "15px", fontSize: "1rem" },
  button: { width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: "#000DFF", color: "#fff", fontWeight: "600", cursor: "pointer" },
  footer: { marginTop: "15px" },
  error: { color: "red", fontSize: "0.9rem", marginBottom: "10px" },
};
