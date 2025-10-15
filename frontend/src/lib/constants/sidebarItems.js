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
  },
];

export const ticketingItems = [
  {
    title: "Tickets",
    url: "/tickets",
    icon: Ticket,
  },
  {
    title: "Services",
    url: "/services",
    icon: Hammer,
  },
];

export const userManagementItems = [
  {
    title: "Access Control",
    url: "/access-control",
    icon: LockKeyhole,
  },
  {
    title: "Departments",
    url: "/departments",
    icon: Building2,
  },
];
