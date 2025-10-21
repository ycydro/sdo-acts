import React from "react";
import { Outlet } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import ClientHeader from "../components/custom/layout/ClientHeader";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen min-w-screen overflow-hidden">
      <ClientHeader />
      <div className="flex-1 m-3 p-5 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
