import React from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const user = true;

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
