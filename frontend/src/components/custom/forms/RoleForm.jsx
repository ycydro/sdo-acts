import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import PermissionsTable from "@/components/custom/tables/PermissionsTable";

export function RoleForm({ role }) {
  const [name, setName] = useState(role?.name || "");

  useEffect(() => {
    if (role) {
      setName(role.name || "");
    }
  }, [role]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-semibold">
              Role Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Support Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {role ? "Update Role" : "Create Role"}
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
        <PermissionsTable />
      </div>
    </div>
  );
}
