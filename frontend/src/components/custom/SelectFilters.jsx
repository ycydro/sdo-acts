import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router";

const SelectFilters = ({
  filters = {}, // Current active filters
  onFiltersChange, // Function to update filters
  filterConfig = [], // Configuration for available filters
}) => {
  const navigate = useNavigate();
  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters };

    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "all"
    ) {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }

    if (onFiltersChange) {
      onFiltersChange(newFilters);

      // Update URL search params when filter changes
      const currentUrl = new URL(window.location.href);
      const searchParams = new URLSearchParams(currentUrl.search);

      // Remove the filter if it's set to "all" or empty, otherwise update it
      if (
        value === "all" ||
        value === "" ||
        value === null ||
        value === undefined
      ) {
        searchParams.delete(filterKey);
      } else {
        searchParams.set(filterKey, value);
      }

      if (filterKey.endsWith("_id")) return;

      // If no params left, navigate without query string
      if (searchParams.toString() === "") {
        navigate(currentUrl.pathname, { replace: true });
      } else {
        navigate(`${currentUrl.pathname}?${searchParams.toString()}`, {
          replace: true,
        });
      }
    }
  };

  const clearAllFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({});

      // navigate to current path without any query params
      navigate(window.location.pathname, { replace: true });
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0;
  return (
    <>
      {Object.keys(filterConfig).length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {filterConfig.map((filter) => (
            <div key={filter.key} className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap">
                {filter.label}:
              </label>
              <Select
                value={filters[filter.key] || "all"}
                onValueChange={(value) => handleFilterChange(filter.key, value)}
              >
                <SelectTrigger className="max-w-[220px] h-8">
                  <SelectValue
                    className="truncate"
                    placeholder={`All ${filter.label}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem
                      className="truncate"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="h-8"
              title="Clear Filters"
            >
              <Trash2 />
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default SelectFilters;
