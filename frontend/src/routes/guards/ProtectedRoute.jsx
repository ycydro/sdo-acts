import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isLoggingOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center mt-20">Loading...</div>;
  }

  if (!user && !isLoggingOut) {
    const fullPath = location.pathname + location.search + location.hash;

    // store the intended destination before redirecting to login
    if (fullPath !== "/login") {
      console.log("[ProtectedRoute] Storing redirect path:", fullPath);
      sessionStorage.setItem("redirectPath", fullPath);
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
