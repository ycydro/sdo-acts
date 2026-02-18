import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useDepartmentMutations } from "../../../hooks/queries/department/useDepartmentMutations";

import { useNavigate } from "react-router-dom";
import EditDepartmentModal from "../modals/Department/EditDepartmentModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import { Skeleton } from "@/components/ui/skeleton";

export const DepartmentList = ({ departments, isLoading }) => {
  const { deleteDepartment } = useDepartmentMutations();

  const [selectedDept, setSelectedDept] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (department) => {
    setSelectedDept(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (departmentID, departmentName) => {
    try {
      await deleteDepartment.mutateAsync(departmentID);
      toast.success(
        `${departmentName} department has been deleted successfully!`,
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete department.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className="border border-primary/50">
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-3 max-w-full">
                <div className="flex gap-2 items-center flex-1 min-w-0">
                  {/* Badge skeleton */}
                  <Skeleton className="h-5 w-16 rounded-full" />

                  {/* Title skeleton */}
                  <Skeleton className="h-5 w-32" />
                </div>

                {/* Menu button skeleton */}
                <Skeleton className="h-8 w-8 rounded-md -mt-1" />
              </div>

              <div className="space-y-2 mb-4 min-h-[3.75rem]">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>

              <div className="pt-4 border-t border-border">
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!isLoading && departments.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No departments available.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {selectedDept && (
        <EditDepartmentModal
          key={selectedDept.id}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          department={selectedDept}
        />
      )}
    </>
  );
};

const DepartmentCard = ({ department, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card
        key={department.id}
        className="border border-primary/50 hover:shadow-lg"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3 max-w-full">
            <div className="flex gap-2 items-center flex-1 min-w-0">
              <Badge variant="default" className="py-1 text-xs">
                {department.department_code}
              </Badge>
              <h3 className="text-md font-semibold text-card-foreground truncate">
                {department.name}
              </h3>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 -mt-1 hover:text-primary"
                >
                  <span className="sr-only">Open menu</span>
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="right">
                <DropdownMenuItem
                  onClick={() => navigate(`/main/tickets/${department.id}`)}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(department)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setIsModalOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 min-h-[3.75rem]">
            {department.description}
          </p>

          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-1">
              Department Head
            </div>
            <div className="text-sm font-medium text-card-foreground">
              {department.department_head ?? "No one"}
            </div>
          </div>
        </div>
      </Card>

      <ConfirmationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={() => onDelete(department.id, department.name)}
        title="Are you sure you want to delete this department?"
        description={`This will delete the '${department.name}' department.`}
        isDestructive={true}
      />
    </>
  );
};
