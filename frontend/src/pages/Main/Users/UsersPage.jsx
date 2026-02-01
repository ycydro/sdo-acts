import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import BackgroundWrapper from "../../../components/custom/BackgroundWrapper";
import { useDepartments } from "../../../hooks/queries/department/useDepartments";
import UsersTable from "@/components/custom/tables/UsersTable";
import AddUserModal from "@/components/custom/modals/Users/AddUserModal";

const UsersPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, isLoading } = useDepartments();
  const departments = data?.data ?? [];

  if (isLoading) return <div>Still Loading</div>;

  return (
    <BackgroundWrapper>
      <main className="min-w-full flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Users</h2>
          <Button variant="sdo-secondary" onClick={() => setShowAddModal(true)}>
            <Plus />
            Add User
          </Button>
        </div>
        <UsersTable />

        <AddUserModal open={showAddModal} onOpenChange={setShowAddModal} />
      </main>
    </BackgroundWrapper>
  );
};

export default UsersPage;
