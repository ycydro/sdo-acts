import React from "react";
import { Outlet } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "../components/custom/layout/AppSidebar";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0">
          {/* Top bar with trigger */}
          <div className="flex items-center py-4 px-2 border-b bg-white">
            <SidebarTrigger className="hover:text-primary" />
            <span className="ml-2 font-bold">Header</span>
          </div>
          <div className="flex-1 m-3 p-4 overflow-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
