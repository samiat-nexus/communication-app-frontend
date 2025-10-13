// src/App.js
import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, login, signup, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Handle Login / Signup ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill all fields!");

    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError("Authentication failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // --- Logged-in View ---
  if (user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>👋 Welcome, {user.email}</h1>
          <p style={styles.subtitle}>You are now securely logged in.</p>
          <button style={styles.logoutButton} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  // --- Login / Signup View ---
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {isSignup ? "✨ Create Account" : "🔐 Welcome Back"}
        </h1>
        <p style={styles.subtitle}>
          {isSignup ? "Join and start chatting now!" : "Sign in to continue"}
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              background: isSignup ? "#6C63FF" : "#000DFF",
            }}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
        </form>

        <p style={styles.footerText}>
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            style={styles.link}
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
          >
            {isSignup ? "Login" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}

// --- Gorgeous Modern Styling ---
const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    width: "380px",
    padding: "40px",
    borderRadius: "18px",
    background: "#fff",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    textAlign: "center",
    transition: "0.3s",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#555",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    fontSize: "1rem",
    outline: "none",
    transition: "0.2s",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    marginTop: "5px",
    transition: "0.3s ease",
  },
  logoutButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "#FF3B3B",
    color: "#fff",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    marginTop: "15px",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "0.9rem",
    color: "#444",
  },
  link: {
    color: "#000DFF",
    cursor: "pointer",
    fontWeight: "600",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
    marginBottom: "10px",
  },
};

export default App;
