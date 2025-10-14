// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, signup as apiSignup, getCurrentUser } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);

  // On startup — if token exists, fetch current user
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingInit(false);
        return;
      }
      try {
        const data = await getCurrentUser(token);
        // API may return user directly or { user: ... }
        const currentUser = data.user ?? data;
        setUser(currentUser);
      } catch (err) {
        console.error("Init getCurrentUser failed:", err);
        localStorage.removeItem("token");
      } finally {
        setLoadingInit(false);
      }
    };
    init();
  }, []);

  // Login
  const login = async (email, password) => {
    setAuthLoading(true);
    setError(null);
    try {
      const res = await apiLogin({ email, password });
      // expect res = { token, user }
      if (res?.token) {
        localStorage.setItem("token", res.token);
        setUser(res.user ?? res);
        setAuthLoading(false);
        return true;
      }
      setError("Invalid login response");
      setAuthLoading(false);
      return false;
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || "Login failed");
      setAuthLoading(false);
      return false;
    }
  };

  // Signup
  const signup = async (email, password) => {
    setAuthLoading(true);
    setError(null);
    try {
      const res = await apiSignup({ email, password });
      if (res?.token) {
        localStorage.setItem("token", res.token);
        setUser(res.user ?? res);
        setAuthLoading(false);
        return true;
      }
      setError("Invalid signup response");
      setAuthLoading(false);
      return false;
    } catch (err) {
      console.error("Signup error:", err);
      setError(err?.response?.data?.message || "Signup failed");
      setAuthLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loadingInit,
      authLoading,
      error,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
