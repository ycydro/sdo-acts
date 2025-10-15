import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DepartmentList } from "../../components/custom/lists/DepartmentList";
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
  return (
    <main className="min-w-full">
      <div className="mb-8 flex gap-6 items-center justify-between px-1">
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search departments..."
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Total Departments:</span>
          <span className="font-semibold text-foreground">
            {departments.length}
          </span>
        </div>
      </div>

      {/* Department List */}
      <DepartmentList departments={departments} />
    </main>
  );
};

export default DepartmentsPage;
