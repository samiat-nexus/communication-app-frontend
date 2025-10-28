import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loadingInit } = useAuth();

  if (loadingInit) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}
