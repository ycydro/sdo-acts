import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

import PermissionsTable from "@/components/custom/tables/PermissionsTable";

export function RoleForm({ role, handleClose }) {
  const [name, setName] = useState(role?.name || "");
  const [permissions, setPermissions] = useState(
    role?.permissions.map((permission) => permission.name) || []
  );
  const [isModifiable, setIsModifiable] = useState(false);

  const handlePermissionChange = (permission, checked) => {
    setPermissions((prevPermissions) => {
      if (checked) {
        return [...prevPermissions, permission];
      } else {
        return prevPermissions.filter((p) => p !== permission);
      }
    });
  };

  useEffect(() => {
    if (role) {
      setName(role.name || "");
      setPermissions(
        role?.permissions.map((permission) => permission.name) || []
      );
    }
  }, [role]);

  useEffect(() => {
    console.log(permissions, "PERMISSIONS");
  }, [permissions]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between w-full">
              <Label htmlFor="name" className="text-foreground font-semibold">
                Role Name
              </Label>
              <button
                className="cursor-pointer"
                type="button"
                onClick={() => handleClose(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Input
              disabled={!isModifiable}
              id="name"
              placeholder="e.g., Support Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              className="flex-1"
              type="button"
              onClick={
                isModifiable
                  ? () => setIsModifiable(false)
                  : () => setIsModifiable(true)
              }
            >
              {isModifiable && role ? "Update Role" : "Edit Role"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      <div>
        <PermissionsTable
          permissions={permissions}
          onPermissionChange={handlePermissionChange}
          isModifiable={isModifiable}
        />
      </div>
    </div>
  );
}
