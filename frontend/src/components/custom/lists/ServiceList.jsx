import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import clsx from "clsx";
import {
  formatTimeDisplay,
  convertMinutesToTimeParts,
} from "../../../lib/timeUtils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

import { useNavigate } from "react-router-dom";

export const ServiceList = ({ services }) => {
  //   const { deleteDepartment } = useDepartmentMutations();

  //   const [selectedDept, setSelectedDept] = useState(null);
  //   const [isModalOpen, setIsModalOpen] = useState(false);

  //   const handleEdit = (department) => {
  //     setSelectedDept(department);
  //     setIsModalOpen(true);
  //   };

  //   const handleDelete = async (departmentID, departmentName) => {
  //     try {
  //       await deleteDepartment.mutateAsync(departmentID);
  //       toast.success(
  //         `${departmentName} department has been deleted successfully!`
  //       );
  //     } catch (error) {
  //       console.error(error);
  //       toast.error(
  //         error.response?.data?.message || "Failed to delete department."
  //       );
  //     }
  //   };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          //   onEdit={handleEdit}
          //   onDelete={handleDelete}
        />
      ))}

      {/* <EditDepartmentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        department={selectedDept}
      /> */}
    </div>
  );
};

const ServiceCard = ({ service, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const CLASSIFICATION_STYLES = {
    Simple: {
      border: "border-primary/50",
      classification_text: "text-primary",
    },
    Complex: {
      border: "border-[var(--high)]/50",
      classification_text: "text-[var(--high)]",
    },
  };

  const processing_time = convertMinutesToTimeParts(
    service.processing_time_in_minutes
  );

  // style base sa classification
  const styles = CLASSIFICATION_STYLES[service.classification] || {};

  return (
    <Card
      key={service.id}
      className={clsx("border-2 shadow-md", styles.border)}
    >
      <div className="px-6 py-7 space-y-1.5">
        <div className="flex items-start max-w-full">
          <h3 className="text-md text-card-foreground truncate">
            {service.name}
          </h3>
        </div>

        <div className="flex items-center justify-between max-w-full">
          <p className="text-2xl font-semibold line-clamp-3">
            {formatTimeDisplay(
              processing_time.days,
              processing_time.hours,
              processing_time.minutes
            )}
          </p>

          <p
            className={clsx(
              "text-md line-clamp-3 font-semibold",
              styles.classification_text
            )}
          >
            {service.classification}
          </p>
        </div>
      </div>
    </Card>
  );
};
