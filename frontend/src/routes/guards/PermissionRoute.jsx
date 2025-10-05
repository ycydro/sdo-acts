import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Unauthorized from "../../pages/Unauthorized";

const PermissionRoute = ({ children, requiredPermission }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const hasPermission = user.permissions?.includes(requiredPermission);

  if (!hasPermission) return <Unauthorized />;

  return children;
};

export default PermissionRoute;
