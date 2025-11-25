import { useState, useMemo, useEffect } from "react";
import DataTable from "./DataTable";
import { usePagination } from "../../../hooks/usePagination";
import { Badge } from "@/components/ui/badge";
import { useDepartments } from "@/hooks/queries/department/useDepartments";
import { useTickets } from "@/hooks/queries/ticket/useTickets";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Ellipsis, Eye } from "lucide-react";
import ViewTicketDetailsModal from "../modals/Ticket/ViewTicketDetailsModal";

const TicketsTable = () => {
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
  const [filters, setFilters] = useState({});

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
          { value: "Ongoing", label: "Ongoing" },
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
        size: 120,
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
        maxSize: 400,
        cell: (info) => {
          const service = info.getValue();
          const serviceName = service?.name || "N/A";
          return <div className="truncate">{serviceName}</div>;
        },
      },
      {
        accessorKey: "service.department",
        header: "Department",
        maxSize: 125,
        cell: (info) => {
          const department = info.getValue();
          const departmentCode = department?.department_code || "N/A";
          return <div className="truncate">{departmentCode}</div>;
        },
      },
      {
        accessorKey: "details",
        header: "Details",
        size: 100,
        minSize: 100,
        maxSize: 250,
        cell: (info) => {
          const details = info.getValue();
          const displayText = details ? details : "No Details.";
          return (
            <div className="truncate" title={details}>
              {displayText}
            </div>
          );
        },
      },
      {
        accessorKey: "assignee",
        header: "Assignee",
        size: 150,
        cell: (info) => {
          const assignee = info.getValue();
          const assigneeName = assignee
            ? `${assignee.first_name} ${assignee.last_name}`
            : "Unassigned";
          return <div className="truncate">{assigneeName}</div>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: (info) => {
          const status = info.getValue();
          const statusColors = {
            Unapproved: "bg-red-100 text-red-800",
            Ongoing: "bg-blue-100 text-blue-800",
            Resolved: "bg-yellow-100 text-yellow-800",
          };

          return (
            <Badge
              className={`px-2 py-1 rounded-full text-xs font-medium truncate ${
                statusColors[status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "id",
        header: "Action",
        size: 300,
        cell: (info) => {
          const ticket = info.row.original;
          const id = info.getValue();

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 -mt-1 hover:text-primary"
                >
                  <span className="sr-only">Open menu</span>
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="left">
                <DropdownMenuItem
                  onClick={() => handleOpenModal(ticket, "view-details")}
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
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
        searchPlaceholder="Search by ticket code, service, or status..."
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
    </div>
  );
};

export default TicketsTable;
