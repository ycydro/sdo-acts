import { Ticket } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";

const TicketRequestCard = ({
  ticketNumber,
  priority,
  issueType,
  description,
  client,
  timeAgo,
}) => {
  return (
    <div className="p-2 shadow-md border border-black/50 flex-2 min-w-[300px] bg-[f9f9fa]">
      <div className="flex gap-1">
        <p className="truncate text-lg font-semibold">Ticket #{ticketNumber}</p>
        <Badge variant={priority}>{priority}</Badge>
      </div>
      <div className="text-sm space-y-2">
        <p className="text-xs">{issueType}</p>
        <p>{description}</p>
      </div>
      <div className="flex gap-3 mt-5 text-sm">
        <p className="font-semibold">{client}</p>
        <span className="text-gray-500">{timeAgo}</span>
      </div>
    </div>
  );
};

// TicketRequestCard.defaultProps = {
//   ticketNumber: "0001",
//   priority: "Medium",
//   issueType: "Laptop issue",
//   description:
//     "Bigla nalang namatay yung laptophuling ko nagamit nung nakaraan linggo pa",
//   assignee: "Joshua P.",
//   timeAgo: "8 mins ago",
// };

export default TicketRequestCard;
