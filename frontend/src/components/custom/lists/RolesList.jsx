import { Skeleton } from "@/components/ui/skeleton";
import { useTicketStatusCount } from "@/hooks/queries/ticket/useTicketStatusCount";

import clsx from "clsx";
import { Ticket } from "lucide-react";
import { LoaderIcon } from "lucide-react";

export const RolesList = ({ roles, onSelectRole, selectedRoleID }) => {
  return (
    <div className="space-y-3.5 overflow-y-auto min-w-100 max-h-[79vh] p-1.5">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          onSelectRole={onSelectRole}
          className={selectedRoleID === role.id ? "bg-gray-100" : "bg-white"}
        />
      ))}
    </div>
  );
};

const RoleCard = ({ role, onSelectRole, className }) => {
  return (
    <div
      className={clsx(
        " border border-primary shadow-md p-5 rounded-3xl space-y-2 cursor-pointer",
        className
      )}
      onClick={() => onSelectRole(role)}
    >
      <div className="flex justify-between">
        <p className="truncate">{role?.name ?? "N/A"}</p>
      </div>
    </div>
  );
};
