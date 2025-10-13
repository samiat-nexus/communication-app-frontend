// src/pages/Login.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/auth";

const Login = () => {
  const { login: loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password });
      loginUser(userData);
    } catch (err) {
      setError("Invalid email or password ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login to Your Account</h2>
        <p style={styles.subtitle}>Welcome back! Please sign in.</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

// --- Styling ---
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #6B73FF, #000DFF)",
  },
  card: {
    width: "350px",
    padding: "40px",
    borderRadius: "16px",
    background: "#fff",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "10px",
    color: "#111",
  },
  subtitle: {
    color: "#555",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#000DFF",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
    marginBottom: "10px",
  },
};

export default Login;
