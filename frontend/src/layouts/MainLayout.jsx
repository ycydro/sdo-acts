import React from "react";
import { Outlet, Navigate } from "react-router";

const MainLayout = () => {
  const authenticated = false;

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default MainLayout;
