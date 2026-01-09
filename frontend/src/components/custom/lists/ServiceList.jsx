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
import { Clock, EllipsisVertical } from "lucide-react";

import { useNavigate } from "react-router-dom";
import EditServiceModal from "../modals/Services/EditServiceModal";
import PriorityBadge from "../badges/PriorityBadge";

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
      <div className="grid grid-cols-2 gap-4">
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
    Simple: "bg-primary/10 text-primary",
    Complex: "bg-[var(--high)]/10 text-[var(--high)]",
  };

  const processing_time = convertMinutesToTimeParts(
    service.processing_time_in_minutes
  );

  return (
    <Card className="hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex justify-between items-start gap-2">
        <div className="space-y-1">
          {/* Title */}
          <h3 className="text-md font-semibold text-card-foreground leading-tight">
            {service.name}
          </h3>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {service.priority && <PriorityBadge priority={service.priority} />}

            {service.classification && (
              <Badge
                variant="secondary"
                className={`font-semibold ${
                  CLASSIFICATION_STYLES[service.classification]
                }`}
              >
                {service.classification}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(service)}>
              Edit
            </DropdownMenuItem>
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(service)}>
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Body */}
      <div className="px-4 pb-4 flex-1">
        {/* Processing Time - Clear and Simple */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-1">Processing Time:</p>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {formatTimeDisplay(
                processing_time.days,
                processing_time.hours,
                processing_time.minutes
              )}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
