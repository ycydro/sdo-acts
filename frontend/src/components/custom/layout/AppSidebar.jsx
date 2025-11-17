import React from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

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
  const location = useLocation();
  const { user } = useAuth();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarContent>
          <SidebarSection
            label="Overview"
            items={overviewItems}
            permissions={user?.permissions}
            basePath={"main"}
          />
          <SidebarSection
            label="Ticketing"
            items={ticketingItems}
            permissions={user?.permissions}
            basePath={"main"}
          />
          <SidebarSection
            label="User Management"
            items={userManagementItems}
            permissions={user?.permissions}
            basePath={"main"}
          />
        </SidebarContent>
      </SidebarContent>
      <SidebarFooter className="py-3 px-4">
        <div className="flex items-center gap-1">
          <img src={Logo} alt="Logo" className="w-17 h-17" />
          <span className="font-semibold text-xl">SDO-ACTS</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

const SidebarSection = ({ label, items, permissions, basePath }) => (
  <SidebarGroup>
    <SidebarGroupLabel>{label}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => {
          if (permissions?.includes(item.permission)) {
            const path = `/${basePath}${item.url}`;
            const isActive = location.pathname.startsWith(path);
            return (
              <SidebarMenuItem
                key={item.title}
                className={clsx(
                  "py-0.5 rounded-md transition-[border] duration-150",
                  {
                    "bg-white text-primary font-bold border-l-7 border-[var(--sdo-secondary)]":
                      isActive,
                  }
                )}
              >
                <SidebarMenuButton asChild>
                  <Link
                    to={`/${basePath}${item.url}`}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          } else {
            return null;
          }
        })}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

export default AppSidebar;
