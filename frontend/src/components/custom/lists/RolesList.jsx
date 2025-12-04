import { Skeleton } from "@/components/ui/skeleton";
import { useTicketStatusCount } from "@/hooks/queries/ticket/useTicketStatusCount";

import clsx from "clsx";
import { Ticket, LoaderIcon } from "lucide-react";

export const RolesList = ({
  roles,
  onSelectRole,
  selectedRoleID,
  isCreatingNew,
  isEditing,
}) => {
  return (
    <div className="space-y-3.5 overflow-y-auto min-w-100 max-h-[79vh] p-1.5">
      {isCreatingNew && (
        <div className="border-2 border-dashed border-primary bg-primary/5 p-4 rounded-3xl mb-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-primary">
              Creating new role...
            </p>
          </div>
        </div>
      )}

      {isEditing && selectedRoleID && (
        <div className="border-2 border-yellow-500 bg-yellow-50 p-4 rounded-3xl mb-3">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 bg-yellow-500 rounded-full mt-1.5 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-yellow-700">
                Editing in progress
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Save or cancel before selecting another role
              </p>
            </div>
          </div>
        </div>
      )}

      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          onSelectRole={onSelectRole}
          isEditing={isEditing}
          isSelected={selectedRoleID === role.id}
          isDisabled={isEditing && selectedRoleID !== role.id}
        />
      ))}
    </div>
  );
};

const RoleCard = ({
  role,
  onSelectRole,
  isEditing,
  isSelected,
  isDisabled,
}) => {
  const handleClick = () => {
    if (isDisabled) {
      // no clicking while editing
      return;
    }
    onSelectRole(role);
  };

  return (
    <div
      className={clsx(
        "border border-primary shadow-md p-5 rounded-3xl space-y-2 cursor-pointer transition-all duration-200",
        isSelected
          ? "bg-primary/10 border-2 border-primary"
          : "bg-white hover:bg-gray-50",
        isDisabled && "opacity-50 cursor-not-allowed hover:bg-white"
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium text-lg">{role?.name ?? "N/A"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {role.permissions?.length || 0} permissions
          </p>
        </div>

        {isSelected && isEditing && (
          <span className="flex-shrink-0 ml-2 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
            Editing
          </span>
        )}

        {isSelected && !isEditing && (
          <span className="flex-shrink-0 ml-2 text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded-full">
            Selected
          </span>
        )}
      </div>
    </div>
  );
};
