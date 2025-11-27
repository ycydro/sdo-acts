import { Skeleton } from "@/components/ui/skeleton";
import { useTicketStatusCount } from "@/hooks/queries/ticket/useTicketStatusCount";

import { Ticket } from "lucide-react";
import { LoaderIcon } from "lucide-react";

export const RolesList = ({ roles }) => {
  return (
    <div className="space-y-3.5 overflow-y-auto min-w-100 max-h-[79vh] p-1.5">
      {roles.map((role) => (
        <RoleCard key={role.id} role={role.name} />
      ))}
    </div>
  );
};
const RoleCard = ({ role }) => {
  return (
    <div className="bg-white border border-primary shadow-md p-5 rounded-3xl space-y-2">
      <div className="flex justify-between ">
        <p className="truncate">{role}</p>
      </div>
    </div>
  );
};
