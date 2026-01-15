import { useState, useMemo, useEffect } from "react";
import DataTable from "./DataTable";
import { usePagination } from "../../../hooks/usePagination";
import { Badge } from "@/components/ui/badge";
import { useDepartments } from "@/hooks/queries/department/useDepartments";
import { useTickets } from "@/hooks/queries/ticket/useTickets";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

import { Edit, Eye } from "lucide-react";
import ViewTicketDetailsModal from "../modals/Ticket/ViewTicketDetailsModal";
import ChangeTicketStatusModal from "../modals/Ticket/ChangeTicketStatusModal";
import { statusColors } from "@/lib/constants/statusColors";
import { useNavigate } from "react-router-dom";
import PriorityBadge from "../badges/PriorityBadge";
import StatusBadge from "../badges/StatusBadge";

const TicketsTable = ({ initialFilters = {} }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleOpenModal = (ticket, modalType) => {
    setSelectedTicket(ticket);
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const { user } = useAuth();

  const isAdmin = user?.role === "Superadmin";

  const { pagination, setPagination } = usePagination();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    ...initialFilters,
  });

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
    const filters = [
      {
        key: "status",
        label: "Status",
        options: [
          { value: "Unapproved", label: "Unapproved" },
          { value: "Declined", label: "Declined" },
          { value: "In Queue", label: "In Queue" },
          { value: "Ongoing", label: "Ongoing" },
          { value: "On hold", label: "On hold" },
          { value: "Resolved", label: "Resolved" },
        ],
      },
    ];

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
        accessorKey: "ticket_code",
        header: "Code",
        size: 100,
        cell: (info) => (
          <div className="truncate">
            <strong>{info.getValue()}</strong>
          </div>
        ),
      },
      {
        accessorKey: "client",
        header: "Client",
        size: 100,
        cell: (info) => {
          const client = info.getValue();
          const clientName = client
            ? `${client.first_name} ${client.last_name}`
            : "N/A";
          return <div className="truncate">{clientName}</div>;
        },
      },
      {
        accessorKey: "service",
        header: "Service",
        maxSize: 220,
        cell: (info) => {
          const service = info.getValue();
          const serviceName = service?.name || "N/A";
          return <div className="truncate">{serviceName}</div>;
        },
      },
      {
        accessorKey: "service.department",
        header: "Department",
        maxSize: 80,
        cell: (info) => {
          const department = info.getValue();
          const departmentCode = department?.department_code || "N/A";
          return <div className="truncate">{departmentCode}</div>;
        },
      },
      {
        accessorKey: "service.priority",
        header: "Priority",
        maxSize: 125,
        cell: (info) => {
          const priority = info.getValue();
          return <PriorityBadge priority={priority} />;
        },
      },

      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: (info) => {
          const status = info.getValue();
          return (
            <StatusBadge status={status} className="!px-2 !py-1 !text-xs" />
          );
        },
      },
      {
        accessorKey: "assignee",
        header: "In Charge",
        size: 100,
        cell: (info) => {
          const assignee = info.getValue();
          const assigneeName = assignee
            ? `${assignee.first_name} ${assignee.last_name}`
            : "Unassigned";
          return <div className="truncate">{assigneeName}</div>;
        },
      },
      {
        accessorKey: "id",
        header: "Actions",
        size: 120,
        cell: (info) => {
          const ticket = info.row.original;
          const id = info.getValue();

          return (
            <div className="flex justify-center items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-auto px-0.5 hover:text-primary"
                title="View Details"
                onClick={() => navigate(`/main/tickets/view/${id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>

              {!["Resolved", "Declined"].includes(ticket.status) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-auto px-0.5 hover:text-primary"
                  title="Change Status"
                  onClick={() => handleOpenModal(ticket, "change-status")}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Status
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [navigate, handleOpenModal]
  );

  const {
    data: ticketsData,
    isLoading: loading,
    error,
  } = useTickets(pagination, searchQuery, filters);

  // Extract data from response
  const tickets = ticketsData?.data || [];
  const rowCount = ticketsData?.count || 0;

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading tickets: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tickets</h2>
        <div className="text-sm text-gray-500">Total: {rowCount} tickets</div>
      </div>

      <DataTable
        columns={columns}
        data={tickets}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearch={handleSearch}
        searchPlaceholder="Search by ticket code or service..."
        filters={filters}
        onFiltersChange={handleFiltersChange}
        filterConfig={filterConfig}
        loading={loading}
      />
      <ViewTicketDetailsModal
        ticket={selectedTicket}
        open={activeModal === "view-details"}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
        onClose={() => setSelectedTicket(null)}
      />
      <ChangeTicketStatusModal
        ticket={selectedTicket}
        open={activeModal === "change-status"}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
};

export default TicketsTable;
