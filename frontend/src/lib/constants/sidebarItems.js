import {
  LayoutDashboard,
  Ticket,
  Hammer,
  LockKeyhole,
  Building2,
} from "lucide-react";

export const overviewItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    permission: "view_main",
  },
];

export const ticketingItems = [
  {
    title: "Departments",
    url: "/departments",
    icon: Building2,
    permission: "view_departments",
  },
  {
    title: "Tickets",
    url: "/tickets",
    icon: Ticket,
    permission: "view_main",
  },
  {
    title: "Services",
    url: "/services",
    icon: Hammer,
    permission: "view_departments",
  },
];

export const userManagementItems = [
  {
    title: "Access Control",
    url: "/access-control",
    icon: LockKeyhole,
    permission: "view_main",
  },
];
