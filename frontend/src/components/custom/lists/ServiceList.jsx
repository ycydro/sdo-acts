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
import EditServiceModal from "../modals/Services/EditServiceModal";

export const ServiceList = ({ services }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleModalClose = (open) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedService(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onEdit={handleEdit} />
        ))}
      </div>

      {selectedService && (
        <EditServiceModal
          key={selectedService.id}
          open={isModalOpen}
          onOpenChange={handleModalClose}
          service={selectedService}
        />
      )}
    </>
  );
};

const ServiceCard = ({ service, onEdit, onDelete }) => {
  const CLASSIFICATION_STYLES = {
    Simple: {
      border: "border-primary/50",
      classification_text: "text-primary",
      badge: "bg-primary/10 text-primary hover:bg-primary/20",
    },
    Complex: {
      border: "border-[var(--high)]/50",
      classification_text: "text-[var(--high)]",
      badge: "bg-[var(--high)]/10 text-[var(--high)] hover:bg-[var(--high)]/20",
    },
  };

  const PRIORITY_STYLES = {
    High: {
      badge: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },
    Medium: {
      badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
      dot: "bg-yellow-500",
    },
    Low: {
      badge: "bg-green-50 text-green-700 border-green-200",
      dot: "bg-green-500",
    },
  };

  const processing_time = convertMinutesToTimeParts(
    service.processing_time_in_minutes
  );

  // style base sa classification
  const styles = CLASSIFICATION_STYLES[service.classification] || {};
  const priorityStyle = PRIORITY_STYLES[service.priority] || {};

  return (
    <Card
      key={service.id}
      className={clsx("hover:shadow-md transition-shadow duration-200")}
    >
      <div className="px-6 py-7 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-md font-medium text-card-foreground truncate">
              {service.name}
            </h3>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:text-primary ml-2 flex-shrink-0"
              >
                <span className="sr-only">Open menu</span>
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(service)}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-3 border-t">
          {/* Processing Time */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Processing Time
            </p>
            <p className="text-md font-semibold">
              {formatTimeDisplay(
                processing_time.days,
                processing_time.hours,
                processing_time.minutes
              )}
            </p>
          </div>

          {/* Priority */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Priority</p>
            {service.priority ? (
              <div className="flex items-center gap-2">
                <span
                  className={clsx("w-2 h-2 rounded-full", priorityStyle.dot)}
                />
                <span className="text-md font-semibold">
                  {service.priority}
                </span>
              </div>
            ) : (
              <p className="text-md font-semibold text-muted-foreground">-</p>
            )}
          </div>

          {/* Classification */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Classification</p>
            <p
              className={clsx(
                "text-md font-semibold",
                styles.classification_text
              )}
            >
              {service.classification}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
