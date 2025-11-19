import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "./DataTable";
import { usePagination } from "../../../hooks/usePagination";
import { Badge } from "@/components/ui/badge";
import { ticketsService } from "@/api/services/ticketsService";

const TicketsTable = () => {
  const { pagination, setPagination } = usePagination();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  const {
    data: ticketsData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["tickets", pagination, searchQuery, filters],
    queryFn: () =>
      ticketsService.getAll({
        search: searchQuery,
        filters: filters,
        page: pagination.pageIndex,
        limit: pagination.pageSize,
      }),
    keepPreviousData: true,
    staleTime: 5000,
  });

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

  const filterConfig = useMemo(() => {
    return [
      {
        key: "status",
        label: "Status",
        options: [
          { value: "Open", label: "Open" },
          { value: "Closed", label: "Closed" },
        ],
      },
    ];
  }, []);

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
        size: 150,
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
        size: 200,
        cell: (info) => {
          const service = info.getValue();
          const serviceName = service?.name || "N/A";
          return <div className="truncate">{serviceName}</div>;
        },
      },
      {
        accessorKey: "details",
        header: "Details",
        size: 100,
        minSize: 100,
        maxSize: 100,
        cell: (info) => {
          const details = info.getValue();
          const displayText = details ? details : "No Details.";
          return (
            <div
              className="truncate"
              title={details}
              style={{
                maxWidth: "300px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
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
            Open: "bg-blue-100 text-blue-800",
            Closed: "bg-red-100 text-red-800",
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
    ],
    []
  );

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
        searchPlaceholder="Search by ticket code..."
        filters={filters}
        onFiltersChange={handleFiltersChange}
        filterConfig={filterConfig}
        loading={loading}
      />
    </div>
  );
};

export default TicketsTable;
