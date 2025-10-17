import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DepartmentList } from "../../components/custom/lists/DepartmentList";
import { Plus } from "lucide-react";
import AddDepartmentModal from "../../components/custom/modals/AddDepartmentModal";
import BackgroundWrapper from "../../components/custom/BackgroundWrapper";
const initialDepartments = [
  {
    id: "1",
    name: "ICT",
    description: "Tech shi and shenanigans na kailangan gawin",
    manager: "Sir Albert",
  },
  {
    id: "2",
    name: "HR",
    description: "Hawak ko ang sweldo at buhay niyo, kaya ako ang boss",
    manager: "Si Carl",
  },
  {
    id: "3",
    name: "Records",
    description: "Victor Magtagbantay ng inyong dokumentong pagtanggol",
    manager: "John Fred",
  },
];

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <BackgroundWrapper>
      <main className="min-w-full flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Departments</h2>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus />
            Add Department
          </Button>
        </div>
        <div className="mt-8 mb-5 flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search departments..."
              className="w-full"
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
        <DepartmentList departments={departments} />
        <AddDepartmentModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
        />
      </main>
    </BackgroundWrapper>
  );
};

export default DepartmentsPage;
