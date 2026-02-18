import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DepartmentList } from "../../../components/custom/lists/DepartmentList";
import { Plus } from "lucide-react";
import AddDepartmentModal from "../../../components/custom/modals/Department/AddDepartmentModal";
import BackgroundWrapper from "../../../components/custom/BackgroundWrapper";
import { useDepartments } from "../../../hooks/queries/department/useDepartments";

const DepartmentsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useDepartments({ search });
  const departments = data?.data ?? [];

  return (
    <BackgroundWrapper>
      <main className="min-w-full flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Departments</h2>
          <Button variant="sdo-secondary" onClick={() => setShowAddModal(true)}>
            <Plus />
            Add Department
          </Button>
        </div>
        <div className="mt-8 mb-5 flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search department name or department code..."
              className="w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Total Departments:</span>
            <span className="font-semibold text-foreground">
              {departments.length}
            </span>
          </div>
        </div>

        {/* Department List */}
        <DepartmentList departments={departments} isLoading={isLoading} />
        <AddDepartmentModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
        />
      </main>
    </BackgroundWrapper>
  );
};

export default DepartmentsPage;
