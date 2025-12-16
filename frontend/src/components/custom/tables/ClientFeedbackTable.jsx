import { useState, useMemo, useEffect } from "react";
import DataTable from "./DataTable";
import { usePagination } from "../../../hooks/usePagination";
import { useDepartments } from "@/hooks/queries/department/useDepartments";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArrowLeft, Search, Star } from "lucide-react";
import ViewTicketDetailsModal from "../modals/Ticket/ViewTicketDetailsModal";
import ChangeTicketStatusModal from "../modals/Ticket/ChangeTicketStatusModal";
import { statusColors } from "@/lib/constants/statusColors";
import { useNavigate } from "react-router-dom";
import ViewClientFeedbackModal from "../modals/ClientSatisfaction/ViewClientFeedbackModal";
import StarRating from "../StarRating";

const ClientFeedbackTable = ({ initialFilters = {} }) => {
  const navigate = useNavigate();
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
              <p className="font-medium">{row.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {row.comment}
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
          return <div>{row.department}</div>;
        },
      },
      {
        accessorKey: "service",
        header: "Service",
        size: 120,
        cell: (info) => {
          const row = info.row.original;
          return <div>{row.service}</div>;
        },
      },
      {
        accessorKey: "rating",
        header: "Rating",
        size: 100,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center justify-center w-full   gap-2">
              <span className="font-bold">{row.rating}</span>
              <StarRating value={row.rating} />
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

  //   const {
  //     data: ticketsData,
  //     isLoading: loading,
  //     error,
  //   } = useTickets(pagination, searchQuery, filters);

  // Extract data from response
  //   const tickets = ticketsData?.data || [];
  //   const rowCount = ticketsData?.count || 0;

  //   if (error) {
  //     return (
  //       <div className="p-4 text-center text-red-500">
  //         Error loading tickets: {error.message}
  //       </div>
  //     );
  //   }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Feedback</h2>
          {/* <div className="text-sm text-gray-500">Total: {rowCount} feedback</div> */}
        </div>

        <DataTable
          columns={columns}
          data={mockReviews}
          rowCount={mockReviews.length}
          pagination={pagination}
          onPaginationChange={setPagination}
          onSearch={handleSearch}
          searchPlaceholder="Search reviews..."
          filters={filters}
          onFiltersChange={handleFiltersChange}
          filterConfig={filterConfig}
          loading={false}
        />
        {/*
      <ChangeTicketStatusModal
        ticket={selectedTicket}
        open={activeModal === "change-status"}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
        onClose={() => setSelectedTicket(null)}
      /> */}
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

const mockReviews = [
  {
    id: 1,
    name: "Japeth Aguilar",
    comment: "Clear ang instruction at mabilis kumilos...",
    fullComment:
      "Clear ang instruction at mabilis kumilos. Maayos din yung pila dahil sa bagong system.",
    department: "ICT",
    departmentFull: "Information and Communication Technology (ICT)",
    service: "Upgrade",
    rating: 5,
  },
  {
    id: 2,
    name: "Kyle Korver",
    comment: "Sakto lang ang process nila...",
    fullComment: "Sakto lang ang process nila okay pero may delay.",
    department: "FN",
    departmentFull: "Finance",
    service: "IOR",
    rating: 4,
  },
];

export default ClientFeedbackTable;
