import { useState, useMemo, useEffect } from "react";
import DataTable from "./DataTable";
import { usePagination } from "../../../hooks/usePagination";
import { useDepartments } from "@/hooks/queries/department/useDepartments";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

import ViewClientFeedbackModal from "../modals/ClientSatisfaction/ViewClientFeedbackModal";
import StarRating from "../StarRating";
import { useClientSurveyResponses } from "@/hooks/queries/client-satisfaction/useClientSurveyResponses";
import { Eye } from "lucide-react";

const ClientFeedbackTable = ({
  initialFilters = {},
  dateRange, // Just accept dateRange as prop
}) => {
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
