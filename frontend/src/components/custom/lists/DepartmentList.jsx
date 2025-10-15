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

export function DepartmentList({ departments }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((department) => (
        <Card key={department.id} className="cursor-pointer">
          <div className="p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex gap-3">
                <h3 className="text-lg font-semibold text-card-foreground flex-1">
                  {department.name}
                </h3>
                <Badge variant="active" className="py-0">
                  Medium
                </Badge>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 -mt-1"
                  >
                    <span className="sr-only">Open menu</span>
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
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
                {department.manager}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
