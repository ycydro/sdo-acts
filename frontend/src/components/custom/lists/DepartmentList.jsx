"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useDepartmentMutations } from "../../../hooks/queries/useDepartmentMutations";

export function DepartmentList({ departments }) {
  const { deleteDepartment } = useDepartmentMutations();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((department) => (
        <Card
          key={department.id}
          className="border border-primary/50 cursor-pointer hover:shadow-xl"
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
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => deleteDepartment.mutate(department.id)}
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
      ))}
    </div>
  );
}
