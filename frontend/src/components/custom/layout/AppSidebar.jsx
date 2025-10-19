import React from "react";
import { Link } from "react-router-dom";

import Logo from "../../../assets/imgs/SDO-LOGO.webp";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  overviewItems,
  ticketingItems,
  userManagementItems,
} from "../../../lib/constants/sidebarItems";

import { useAuth } from "@/context/AuthContext";
const AppSidebar = () => {
  const { user } = useAuth();
  return (
    <Sidebar>
      <SidebarContent>
        {/* OVERVIEW */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewItems.map(
                (item) =>
                  user?.permissions?.includes(item.permission) && (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={`/main${item.url}`}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* TICKETING */}
        <SidebarGroup>
          <SidebarGroupLabel>Ticketing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ticketingItems.map(
                (item) =>
                  user?.permissions?.includes(item.permission) && (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={`/main${item.url}`}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* USER MANAGEMENT */}
        <SidebarGroup>
          <SidebarGroupLabel>User Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userManagementItems.map(
                (item) =>
                  user?.permissions?.includes(item.permission) && (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={`/main${item.url}`}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border border-t-1 py-3 px-4">
        <div className="flex items-center justify-center gap-1">
          <img src={Logo} alt="Logo" className="w-17 h-17" />
          <span className="font-semibold text-2xl md:text-xl">SDO-ACTS</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
