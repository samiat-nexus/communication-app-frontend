// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { login, signup, getCurrentUser } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Load user on startup ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) setUser(currentUser);
      } catch (error) {
        console.error("❌ Failed to fetch current user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // --- Login handler ---
  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      return true;
    } catch (error) {
      console.error("❌ Login failed:", error);
      return false;
    }
  };

  // --- Signup handler ---
  const handleSignup = async (email, password) => {
    try {
      const data = await signup(email, password);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      return true;
    } catch (error) {
      console.error("❌ Signup failed:", error);
      return false;
    }
  };

  // --- Logout handler ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login: handleLogin, signup: handleSignup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
