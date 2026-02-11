import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "../components/custom/layout/AppSidebar";
import AppHeader from "../components/custom/layout/AppHeader";

const MainLayout = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isApiFullscreen = !!document.fullscreenElement;

      // chech the Display Mode
      const isDisplayFullscreen = window.matchMedia(
        "(display-mode: fullscreen)",
      ).matches;

      setIsFullscreen(isApiFullscreen || isDisplayFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    window.addEventListener("resize", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("resize", handleFullscreenChange);
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen min-w-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0">
          {!isFullscreen && <AppHeader />}
          <div className="flex-1 m-2 p-4 overflow-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
