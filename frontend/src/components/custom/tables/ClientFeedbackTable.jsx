import { useState, useMemo, useEffect } from "react";
import DataTable from "./DataTable";
import { usePagination } from "../../../hooks/usePagination";
import { useDepartments } from "@/hooks/queries/department/useDepartments";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar } from "lucide-react";
import { format, subDays, subMonths, subYears } from "date-fns";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

import ViewClientFeedbackModal from "../modals/ClientSatisfaction/ViewClientFeedbackModal";
import StarRating from "../StarRating";
import { useClientSurveyResponses } from "@/hooks/queries/client-satisfaction/useClientSurveyResponses";
import { Eye } from "lucide-react";

const ClientFeedbackTable = ({
  initialFilters = {},
  initialDateRange = null,
}) => {
  const [searchParams] = useSearchParams();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const handleOpenModal = (feedback, modalType) => {
    setSelectedFeedback(feedback);
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const { user } = useAuth();
  const isAdmin = user?.role === "Superadmin";

  const { pagination, setPagination } = usePagination();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(() => {
    const { department_id, ...otherFilters } = initialFilters;
    return otherFilters;
  });

  // Get date range from URL params or initialDateRange prop
  const [dateRange, setDateRange] = useState(() => {
    // Check URL params first (from DepartmentSatisfactionList navigation)
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (startDateParam && endDateParam) {
      // Determine preset based on the date range
      const startDate = new Date(startDateParam);
      const endDate = new Date(endDateParam);
      const diffInDays = Math.round(
        (endDate - startDate) / (1000 * 60 * 60 * 24),
      );

      let preset = "custom";
      if (diffInDays === 7) preset = "week";
      else if (diffInDays === 30 || diffInDays === 31) preset = "month";
      else if (diffInDays >= 180 && diffInDays <= 190) preset = "sixMonths";
      else if (diffInDays === 365) preset = "year";

      return {
        startDate: startDateParam,
        endDate: endDateParam,
        preset,
      };
    }

    // Use initialDateRange prop if provided
    if (initialDateRange) {
      return initialDateRange;
    }

    // Default: past week
    const endDate = new Date();
    const startDate = subDays(endDate, 7);
    return {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      preset: "week",
    };
  });

  const [isCustomRange, setIsCustomRange] = useState(false);
  const [customDates, setCustomDates] = useState({
    from: undefined,
    to: undefined,
  });

  // Initialize custom dates from URL params if custom range
  useEffect(() => {
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (startDateParam && endDateParam) {
      const startDate = new Date(startDateParam);
      const endDate = new Date(endDateParam);
      const diffInDays = Math.round(
        (endDate - startDate) / (1000 * 60 * 60 * 24),
      );

      // Check if it's a custom range (not matching any preset)
      const isPreset = [7, 30, 31, 180, 365].includes(diffInDays);

      if (!isPreset) {
        setCustomDates({
          from: startDate,
          to: endDate,
        });
      }
    }
  }, []);

  const presetOptions = [
    { label: "Past Week", value: "week" },
    { label: "Past Month", value: "month" },
    { label: "Past 6 Months", value: "sixMonths" },
    { label: "Past Year", value: "year" },
    { label: "Custom Range", value: "custom" },
  ];

  const handlePresetChange = (preset) => {
    if (preset === "custom") {
      setIsCustomRange(true);
      // Pre-populate custom dates with current date range if it's custom
      if (dateRange?.preset === "custom") {
        setCustomDates({
          from: new Date(dateRange.startDate),
          to: new Date(dateRange.endDate),
        });
      }
      return;
    }

    setIsCustomRange(false);
    const endDate = new Date();
    let startDate = new Date();

    switch (preset) {
      case "week":
        startDate = subDays(endDate, 7);
        break;
      case "month":
        startDate = subMonths(endDate, 1);
        break;
      case "sixMonths":
        startDate = subMonths(endDate, 6);
        break;
      case "year":
        startDate = subYears(endDate, 1);
        break;
    }

    const newDateRange = {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      preset,
    };

    setDateRange(newDateRange);
    setCustomDates({ from: undefined, to: undefined });
  };

  const handleCustomRangeCancel = () => {
    setIsCustomRange(false);

    if (dateRange?.preset === "custom") {
      const endDate = new Date();
      const startDate = subDays(endDate, 7);

      const newDateRange = {
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        preset: "week",
      };

      setDateRange(newDateRange);
    }

    setCustomDates({ from: undefined, to: undefined });
  };

  const handleCustomDateChange = (type, date) => {
    const updatedDates = { ...customDates, [type]: date };
    setCustomDates(updatedDates);
  };

  const handleCustomRangeApply = () => {
    if (customDates.from && customDates.to) {
      if (customDates.to < customDates.from) {
        toast.error("End date must be after start date");
        return;
      }

      const newDateRange = {
        startDate: format(customDates.from, "yyyy-MM-dd"),
        endDate: format(customDates.to, "yyyy-MM-dd"),
        preset: "custom",
      };

      setDateRange(newDateRange);
      // setIsCustomRange(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleFiltersChange = (newFilters) => {
    if (initialFilters.department_id) {
      const { department_id, ...filteredFilters } = newFilters;
      setFilters(filteredFilters);
    } else {
      setFilters(newFilters);
    }
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const { data: departments, isLoading: isDepartmentsLoading } =
    useDepartments();

  const filterConfig = useMemo(() => {
    const filters = [];

    if (isAdmin && !initialFilters.department_id) {
      filters.push({
        key: "department_id",
        label: "Departments",
        options:
          departments?.data?.map((department) => ({
            value: department.id,
            label: department.name,
          })) || [],
        disabled: isDepartmentsLoading,
      });
    }

    return filters;
  }, [
    departments,
    isDepartmentsLoading,
    user?.role,
    initialFilters.department_id,
  ]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "review",
        header: "Review",
        size: 300,
        minSize: 200,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="text-left">
              <p className="font-medium">
                {row.client?.first_name} {row.client?.last_name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {row.comment || ""}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "ticket_code",
        header: "Ticket",
        maxSize: 100,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="truncate capitalize font-semibold">
              {row.ticket?.ticket_code}
            </div>
          );
        },
      },
      {
        accessorKey: "department_code",
        header: "Department",
        size: 90,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="capitalize">
              {row.ticket?.service?.department?.department_code}
            </div>
          );
        },
      },
      {
        accessorKey: "service",
        header: "Service",
        maxSize: 350,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="truncate capitalize">
              {row.ticket?.service?.name}
            </div>
          );
        },
      },
      {
        accessorKey: "rating",
        header: "Rating",
        size: 100,
        cell: (info) => {
          const row = info.row.original;
          const rating = parseFloat(row.overall_rating) || 0;
          return (
            <div className="flex items-center justify-center w-full gap-2">
              <span className="font-bold">{rating.toFixed(1)}</span>
              <StarRating value={rating} />
            </div>
          );
        },
      },
      {
        accessorKey: "action",
        header: "Action",
        size: 120,
        cell: (info) => {
          const row = info.row.original;
          return (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-auto px-0.5 hover:text-primary"
              title="View Details"
              onClick={() => handleOpenModal(row, "view-feedback")}
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
          );
        },
      },
    ],
    [],
  );

  const {
    data: surveyResponsesData,
    isLoading: loading,
    error,
  } = useClientSurveyResponses(pagination, searchQuery, {
    ...filters,
    ...(initialFilters.department_id && {
      department_id: initialFilters.department_id,
    }),
    startDate: dateRange?.startDate,
    endDate: dateRange?.endDate,
  });

  // Extract data from response
  const surveyResponses = surveyResponsesData?.data || [];
  const rowCount = surveyResponsesData?.count || 0;

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading survey responses: {error.message}
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Header with Date Range Filter */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Client Feedback
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {dateRange
                ? `Showing data from ${format(new Date(dateRange.startDate), "MMM dd, yyyy")} to ${format(new Date(dateRange.endDate), "MMM dd, yyyy")}`
                : "Select a date range to view data"}
            </p>
          </div>

          {/* Date Range Controls */}
          {!isCustomRange ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select
                value={dateRange?.preset || "week"}
                onValueChange={handlePresetChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {presetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="bg-card">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left truncate"
                      >
                        <Calendar className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {customDates.from
                            ? format(customDates.from, "MMM dd, yyyy")
                            : "Start date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={customDates.from}
                        onSelect={(date) =>
                          handleCustomDateChange("from", date)
                        }
                        initialFocus
                        captionLayout="dropdown"
                        fromYear={2020}
                        disabled={(date) => date >= new Date()}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left truncate"
                      >
                        <Calendar className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {customDates.to
                            ? format(customDates.to, "MMM dd, yyyy")
                            : "End date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={customDates.to}
                        onSelect={(date) => handleCustomDateChange("to", date)}
                        initialFocus
                        captionLayout="dropdown"
                        fromYear={2020}
                        disabled={(date) => date >= new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCustomRangeApply}
                    disabled={!customDates.from || !customDates.to}
                    className="sm:w-24"
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCustomRangeCancel}
                    className="sm:w-24"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <DataTable
          columns={columns}
          data={surveyResponses}
          rowCount={rowCount}
          pagination={pagination}
          onPaginationChange={setPagination}
          onSearch={handleSearch}
          searchPlaceholder="Search feedback..."
          filters={filters}
          onFiltersChange={handleFiltersChange}
          filterConfig={filterConfig}
          loading={loading}
        />
      </div>

      {selectedFeedback && (
        <ViewClientFeedbackModal
          feedback={selectedFeedback}
          open={activeModal === "view-feedback"}
          onOpenChange={(open) => {
            if (!open) handleCloseModal();
          }}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </>
  );
};

export default ClientFeedbackTable;
