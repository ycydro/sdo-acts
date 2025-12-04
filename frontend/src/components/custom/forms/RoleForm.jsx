import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Save, Edit } from "lucide-react";

import PermissionsTable from "@/components/custom/tables/PermissionsTable";

export function RoleForm({
  role,
  isCreatingNew,
  isEditing,
  onSave,
  onCancel,
  onStartEditing,
  onCancelEditing,
  isSaving,
}) {
  const [name, setName] = useState(role?.name || "");
  const [permissions, setPermissions] = useState(
    role?.permissions?.map((permission) => permission.name) || []
  );

  const handlePermissionChange = (permission, checked) => {
    if (!isEditing) return;

    setPermissions((prevPermissions) => {
      if (checked) {
        return [...prevPermissions, permission];
      } else {
        return prevPermissions.filter((p) => p !== permission);
      }
    });
  };

  const handleSave = () => {
    const roleData = {
      id: role?.id,
      name: name.trim(),
      permissions: permissions,
      isNew: isCreatingNew,
    };

    onSave(roleData);
  };

  const handleCancel = () => {
    if (isCreatingNew) {
      onCancel();
    } else {
      // Reset to original values
      setName(role?.name || "");
      setPermissions(
        role?.permissions?.map((permission) => permission.name) || []
      );
      onCancelEditing();
    }
  };

  const handleEditClick = () => {
    onStartEditing();
  };

  const handleClose = () => {
    if (
      isEditing &&
      !window.confirm("You have unsaved changes. Discard changes?")
    ) {
      return;
    }
    handleCancel();
  };

  useEffect(() => {
    if (role) {
      setName(role.name || "");
      setPermissions(
        role?.permissions?.map((permission) => permission.name) || []
      );
    }
  }, [role]);

  useEffect(() => {
    if (!isEditing && role) {
      setName(role.name || "");
      setPermissions(
        role?.permissions?.map((permission) => permission.name) || []
      );
    }
  }, [role, isEditing]);

  return (
    <div className="space-y-6">
      <Card className="p-6 mb-2.5">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <div className="flex justify-between w-full items-center">
              <Label htmlFor="name" className="text-foreground font-semibold">
                Role Name
              </Label>
              <button
                className="cursor-pointer hover:bg-secondary rounded-full p-1"
                type="button"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Input
              disabled={!isEditing}
              id="name"
              placeholder="e.g., Support Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border"
            />
            {isCreatingNew && (
              <p className="text-sm text-muted-foreground">
                Creating a new role
              </p>
            )}
            {isEditing && !isCreatingNew && (
              <p className="text-sm text-yellow-600 font-medium">
                Editing mode - changes not saved yet
              </p>
            )}
          </div>
        </form>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Permissions</h3>
          {!isCreatingNew && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={isEditing ? onCancelEditing : handleEditClick}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {isEditing ? "Cancel Editing" : "Edit Permissions"}
            </Button>
          )}
        </div>
        <PermissionsTable
          permissions={permissions}
          onPermissionChange={handlePermissionChange}
          isModifiable={isEditing}
        />
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              className="flex-1"
              type="button"
              onClick={handleSave}
              disabled={isSaving || !name.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving
                ? "Saving..."
                : isCreatingNew
                ? "Create Role"
                : "Update Role"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button className="w-full" type="button" onClick={handleEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Role
          </Button>
        )}
      </div>
    </div>
  );
}
