import { Skeleton } from "@/components/ui/skeleton";
import { useTicketStatusCount } from "@/hooks/queries/ticket/useTicketStatusCount";

import { Ticket } from "lucide-react";
import { LoaderIcon } from "lucide-react";

const initialRoles = [
  {
    name: "Admin",
    count: 1,
  },
  {
    name: "Department Staff",
    count: 6,
  },
];

export const RolesList = () => {
  return (
    <div className="space-y-3.5 overflow-y-auto min-w-100 max-h-[79vh] p-1.5">
      {initialRoles.map((role, index) => (
        <RoleCard key={index} role={role.name} count={role.count} />
      ))}
    </div>
  );
};
const RoleCard = ({ role, count }) => {
  return (
    <div className="bg-white border border-primary shadow-md p-5 rounded-3xl space-y-2">
      <div className="flex justify-between ">
        <p className="truncate">{role}</p>
      </div>
      <div className="font-bold text-2xl truncate">{count}</div>
    </div>
  );
};
