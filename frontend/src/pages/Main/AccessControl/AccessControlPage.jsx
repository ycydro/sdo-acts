import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BackgroundWrapper from "../../../components/custom/BackgroundWrapper";
import { useDepartments } from "../../../hooks/queries/department/useDepartments";
import PermissionsTable from "@/components/custom/tables/PermissionsTable";
import { RolesList } from "@/components/custom/lists/RolesList";

const AccessControlPage = () => {
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
            <PermissionsTable />
          </div>
          <div className="col-span-1">
            <RolesList />
          </div>
        </section>
      </main>
    </BackgroundWrapper>
  );
};

export default AccessControlPage;
