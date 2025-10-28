// src/pages/Signup.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { signup, authLoading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess("");

    if (!email || !password) return setLocalError("All fields required");
    if (password !== confirmPassword) return setLocalError("Passwords do not match");

    const ok = await signup(email, password);
    if (ok) {
      setSuccess("Account created successfully ✅");
      setTimeout(() => navigate("/dashboard"), 800);
    } else {
      setLocalError(error || "Signup failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>✨ Create an Account</h2>
        <form onSubmit={handleSignup}>
          <input type="email" placeholder="Email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" style={styles.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          {(localError || error) && <p style={styles.error}>{localError || error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <button type="submit" style={styles.button} disabled={authLoading}>
            {authLoading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg,#000DFF,#6B73FF)" },
  card: { width: "350px", padding: "40px", borderRadius: "16px", background: "#fff", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  title: { fontSize: "1.8rem", marginBottom: "25px", color: "#111" },
  input: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "15px", fontSize: "1rem" },
  button: { width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: "#000DFF", color: "#fff", fontWeight: "600", cursor: "pointer" },
  footer: { marginTop: "15px" },
  error: { color: "red", fontSize: "0.9rem", marginBottom: "10px" },
  success: { color: "green", fontSize: "0.9rem", marginBottom: "10px" },
};
