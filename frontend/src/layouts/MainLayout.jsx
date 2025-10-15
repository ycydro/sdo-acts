import React from "react";
import { Outlet } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "../components/custom/layout/AppSidebar";
import AppHeader from "../components/custom/layout/AppHeader";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen min-w-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0">
          <AppHeader />
          <div className="flex-1 m-3 p-4 overflow-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
