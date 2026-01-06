import { useState, useMemo, useEffect } from "react";
import DataTable from "./DataTable";
import { usePagination } from "../../../hooks/usePagination";
import { useDepartments } from "@/hooks/queries/department/useDepartments";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

import ViewClientFeedbackModal from "../modals/ClientSatisfaction/ViewClientFeedbackModal";
import StarRating from "../StarRating";
import { useClientSurveyResponses } from "@/hooks/queries/client-satisfaction/useClientSurveyResponses";

const ClientFeedbackTable = ({ initialFilters = {} }) => {
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
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    if (initialFilters.status && initialFilters.status !== filters.status) {
      setFilters((prev) => ({ ...prev, status: initialFilters.status }));
    }
  }, [initialFilters.status]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // reset to first page when searching
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // reset to first page when filtering
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const { data: departments, isLoading: isDepartmentsLoading } =
    useDepartments();

  const filterConfig = useMemo(() => {
    const filters = [];

    if (isAdmin) {
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
  }, [departments, isDepartmentsLoading, user?.role]);

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
                {row.comment || "No comment"}
              </p>
              <p className="text-xs text-muted-foreground">
                Ticket: {row.ticket?.ticket_code}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "department",
        header: "Department",
        size: 120,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="capitalize">
              {row.ticket?.service?.department?.name}
            </div>
          );
        },
      },
      {
        accessorKey: "service",
        header: "Service",
        size: 120,
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
        header: "",
        size: 120,
        cell: (info) => {
          const row = info.row.original;
          return (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenModal(row, "view-feedback")}
            >
              View Details
            </Button>
          );
        },
      },
    ],
    []
  );

  const {
    data: surveyResponsesData,
    isLoading: loading,
    error,
  } = useClientSurveyResponses(pagination, searchQuery, filters);

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Client Feedback</h2>
          <div className="text-sm text-gray-500">
            {/* Total: {apiResponseData?.count || 0} feedback */}
          </div>
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
