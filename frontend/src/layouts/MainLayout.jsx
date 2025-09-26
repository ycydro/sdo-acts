import React from "react";
import { Outlet } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "../components/custom/AppSidebar";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0">
          {/* Top bar with trigger */}
          <div className="flex items-center p-2 border-b">
            <SidebarTrigger />
            <span className="ml-2 font-bold">Header</span>
          </div>
          <Card className="flex-1 m-3 p-4 overflow-auto">
            <CardContent className="p-0">
              <Outlet />
            </CardContent>
          </Card>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
