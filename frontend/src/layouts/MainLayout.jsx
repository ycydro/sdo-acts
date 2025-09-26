import React from "react";
import { Outlet, Navigate, useNavigate } from "react-router";

const MainLayout = () => {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Outlet />
    </div>
  );
};

export default MainLayout;
