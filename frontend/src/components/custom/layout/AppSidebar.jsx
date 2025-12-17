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
  clientSatisfactionItems,
  overviewItems,
  queueItems,
  ticketingItems,
  userManagementItems,
} from "../../../lib/constants/sidebarItems";

import { useAuth } from "@/context/AuthContext";

const AppSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const sections = [
    {
      label: "Overview",
      items: overviewItems,
      requiredPermission: "view_main",
      basePath: "main",
    },
    {
      label: "Ticketing",
      items: ticketingItems,
      requiredPermission: "view_main",
      basePath: "main",
    },
    {
      label: "Queue",
      items: queueItems,
      requiredPermission: "view_main",
      basePath: "main",
    },
    {
      label: "Client Satisfaction",
      items: clientSatisfactionItems,
      requiredPermission: "view_main",
      basePath: "main",
    },
    {
      label: "User Management",
      items: userManagementItems,
      requiredPermission: "view_user_management",
      basePath: "main",
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        {sections.map((section) => {
          // check if user has permission to see entire section
          const hasSectionPermission =
            !section.requiredPermission ||
            user?.permissions?.includes(section.requiredPermission);

          if (!hasSectionPermission) return null;

          return (
            <SidebarSection
              key={section.label}
              label={section.label}
              items={section.items}
              permissions={user?.permissions}
              basePath={section.basePath}
              location={location}
            />
          );
        })}
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

const SidebarSection = ({ label, items, permissions, basePath, location }) => {
  // filter items based on individual permissions
  const filteredItems = items.filter(
    (item) => !item.permission || permissions?.includes(item.permission)
  );

  if (filteredItems.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {filteredItems.map((item) => {
            const path = `/${basePath}${item.url}`;
            const isActive = location.pathname === path;

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
                  <Link to={path} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default AppSidebar;
