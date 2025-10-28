// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, signup as apiSignup, getCurrentUser } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- On startup: check if user already logged in ---
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingInit(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);
        setUser(data.user ?? data);
      } catch (err) {
        console.error("Init getCurrentUser failed:", err);
        localStorage.removeItem("token");
      } finally {
        setLoadingInit(false);
      }
    };
    init();
  }, []);

  // --- Login ---
  const login = async (email, password) => {
    setAuthLoading(true);
    setError(null);
    try {
      const res = await apiLogin({ email, password });
      if (res?.token) {
        localStorage.setItem("token", res.token);
        setUser(res.user ?? res);
        return true;
      }
      throw new Error("Invalid login response");
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || "Invalid email or password");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // --- Signup ---
  const signup = async (email, password) => {
    setAuthLoading(true);
    setError(null);
    try {
      const res = await apiSignup({ email, password });
      if (res?.token) {
        localStorage.setItem("token", res.token);
        setUser(res.user ?? res);
        return true;
      }
      throw new Error("Invalid signup response");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err?.response?.data?.message || "Signup failed");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // --- Logout ---
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loadingInit, authLoading, error, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
