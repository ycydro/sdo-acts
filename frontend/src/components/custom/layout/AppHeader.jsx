import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AppHeader = () => {
  return (
    <div className="flex items-center py-4 px-2 border-b bg-white">
      <SidebarTrigger className="hover:text-primary" />
      <span className="ml-2 font-bold">Header</span>
    </div>
  );
};

export default AppHeader;
