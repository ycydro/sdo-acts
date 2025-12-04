import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BackgroundWrapper from "../../../components/custom/BackgroundWrapper";
import { RolesList } from "@/components/custom/lists/RolesList";
import { useRoles } from "@/hooks/queries/role/useRoles";
import { RoleForm } from "@/components/custom/forms/RoleForm";

const AccessControlPage = () => {
  const { data: roles, isLoading } = useRoles();

  const [selectedRole, setSelectedRole] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateRole = () => {
    setIsCreatingNew(true);
    setIsEditing(true); // edit mode agad pag new role
    setSelectedRole({
      id: null,
      name: "",
      permissions: [],
      isNew: true,
    });
  };

  const handleSelectRole = (role) => {
    // Check if clicking the same role while editing
    if (isEditing && selectedRole && role.id !== selectedRole.id) {
      // Only show confirmation if clicking a DIFFERENT role
      if (!window.confirm("You have unsaved changes. Switch role anyway?")) {
        return;
      }
    }

    setIsCreatingNew(false);
    setIsEditing(false);
    setSelectedRole(role);
  };

  const handleSaveRole = async (roleData) => {
    try {
      if (roleData.isNew) {
        // await createRoleMutation.mutateAsync({
        //   name: roleData.name,
        //   permissions: roleData.permissions,
        // });
        setIsCreatingNew(false);
        setIsEditing(false);
      } else {
        // await updateRoleMutation.mutateAsync({
        //   id: roleData.id,
        //   name: roleData.name,
        //   permissions: roleData.permissions,
        // });
        setIsEditing(false);
      }
      setSelectedRole(null);
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  };

  const handleCancel = () => {
    setIsCreatingNew(false);
    setIsEditing(false);
    setSelectedRole(null);
  };

  return (
    <BackgroundWrapper>
      <main className="min-w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Access Control</h2>
          <Button
            variant="sdo-secondary"
            onClick={handleCreateRole}
            disabled={isCreatingNew || isEditing}
          >
            <Plus />
            Add Role
          </Button>
        </div>
        <section className="grid gap-5 grid-cols-3 my-2.5">
          <div className="col-span-2">
            {selectedRole ? (
              <RoleForm
                role={selectedRole}
                isCreatingNew={isCreatingNew}
                isEditing={isEditing}
                onSave={handleSaveRole}
                onCancel={handleCancel}
                onStartEditing={() => setIsEditing(true)}
                onCancelEditing={() => setIsEditing(false)}
                isSaving={false}
              />
            ) : (
              <div className="rounded-lg border border-primary bg-card p-3 text-center">
                <p className="text-muted-foreground">
                  {isCreatingNew
                    ? "Creating new role..."
                    : "Select a role to view details"}
                </p>
              </div>
            )}
          </div>
          <div className="col-span-1">
            <RolesList
              roles={roles?.data ?? []}
              selectedRoleID={selectedRole?.id}
              onSelectRole={handleSelectRole}
              isCreatingNew={isCreatingNew}
              isEditing={isEditing}
            />
          </div>
        </section>
      </main>
    </BackgroundWrapper>
  );
};

export default AccessControlPage;
