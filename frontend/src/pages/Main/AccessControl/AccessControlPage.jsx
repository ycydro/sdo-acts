import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BackgroundWrapper from "../../../components/custom/BackgroundWrapper";
import PermissionsTable from "@/components/custom/tables/PermissionsTable";
import { RolesList } from "@/components/custom/lists/RolesList";
import { useRoles } from "@/hooks/queries/role/useRoles";
import { RoleForm } from "@/components/custom/forms/RoleForm";

const AccessControlPage = () => {
  const { data: roles, isLoading } = useRoles();
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <BackgroundWrapper>
      <main className="min-w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Access Control</h2>
          <Button variant="sdo-secondary">
            <Plus />
            Add Role
          </Button>
        </div>
        <section className="grid gap-5 grid-cols-3 my-2.5">
          <div className="col-span-2">
            {selectedRole ? (
              <RoleForm role={selectedRole} />
            ) : (
              <div className="rounded-lg border border-primary bg-card p-8 text-center">
                <p className="text-muted-foreground">
                  Select a role to view details
                </p>
              </div>
            )}
          </div>
          <div className="col-span-1">
            <RolesList
              roles={roles?.data ?? []}
              selectedRoleID={selectedRole?.id}
              onSelectRole={(role) => setSelectedRole(role)}
            />
          </div>
        </section>
      </main>
    </BackgroundWrapper>
  );
};

export default AccessControlPage;
