import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const PermissionRoute = ({ children, requiredPermission }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const hasPermission = user.permissions?.includes(requiredPermission);

  if (!hasPermission) return <Navigate to="/register" replace />;

  return children;
};

export default PermissionRoute;
