import React from "react";
import { Navigate } from "react-router-dom";

const PermissionRoute = ({ children, requiredPermission }) => {
  const user = {
    permissions: ["view_test", "view_main"],
  };

  if (!user) return <Navigate to="/login" replace />;

  const hasPermission = user.permissions?.includes(requiredPermission);

  if (!hasPermission) return <Navigate to="/register" replace />;

  return children;
};

export default PermissionRoute;
