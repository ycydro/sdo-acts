import { Badge } from "@/components/ui/badge";
import { statusColors } from "@/lib/constants/statusColors";
import React from "react";

const StatusBadge = ({ status, className }) => {
  return (
    <Badge
      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium w-fit  ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      } ${className || ""}`}
    >
      {status || "N/A"}
    </Badge>
  );
};

export default StatusBadge;
