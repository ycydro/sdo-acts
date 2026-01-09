import { Badge } from "@/components/ui/badge";
import React from "react";
const PRIORITY_BADGE_STYLES = {
  High: "bg-[var(--high)]",
  Medium: "bg-[var(--medium)]",
  Low: "bg-[var(--low)]/80",
};

const PriorityBadge = ({ priority }) => {
  return (
    <Badge
      variant="secondary"
      className={`text-white font-semibold ${PRIORITY_BADGE_STYLES[priority]}`}
    >
      {priority}
    </Badge>
  );
};

export default PriorityBadge;
