// src/pages/Signup.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // if you use react-router

const Signup = () => {
  const { signup, authLoading, error } = useAuth();
  const navigate = (typeof useNavigate === "function") ? useNavigate() : null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccess("");

    if (!email || !password) {
      setLocalError("Email and password are required");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const ok = await signup(email, password);
    if (ok) {
      setSuccess("Account created successfully ✅");
      // optional redirect
      if (navigate) setTimeout(() => navigate("/"), 700);
    } else {
      setLocalError(error || "Signup failed. Try again");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>✨ Create an Account</h2>
        <p style={styles.subtitle}>Join our community today!</p>

        <form onSubmit={handleSignup}>
          <input type="email" placeholder="Email" style={styles.input}
            value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" style={styles.input}
            value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" style={styles.input}
            value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />

          {(localError || error) && <p style={styles.error}>{localError || error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.button} disabled={authLoading}>
            {authLoading ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { height:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"linear-gradient(135deg,#000DFF,#6B73FF)" },
  card: { width:"350px", padding:"40px", borderRadius:"16px", background:"#fff", textAlign:"center", boxShadow:"0 10px 30px rgba(0,0,0,0.1)" },
  title:{ fontSize:"1.8rem", marginBottom:"10px", color:"#111" }, subtitle:{ color:"#555", marginBottom:"25px" },
  input:{ width:"100%", padding:"12px", borderRadius:"8px", border:"1px solid #ccc", marginBottom:"15px", fontSize:"1rem" },
  button:{ width:"100%", padding:"12px", borderRadius:"8px", border:"none", background:"#000DFF", color:"#fff", fontWeight:"600", cursor:"pointer" },
  error:{ color:"red", fontSize:"0.9rem", marginBottom:"10px" }, success:{ color:"green", fontSize:"0.9rem", marginBottom:"10px" }
};

export default Signup;
