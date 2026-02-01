import { useState, useMemo, useEffect } from "react";
import DataTable from "./DataTable";
import { usePagination } from "../../../hooks/usePagination";
import { Badge } from "@/components/ui/badge";
import { useDepartments } from "@/hooks/queries/department/useDepartments";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUsers } from "@/hooks/queries/users/useUsers";
import { useRoles } from "@/hooks/queries/role/useRoles";

const UsersTable = ({ initialFilters = {} }) => {
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
  // const [rowSelection, setRowSelection] = useState({}); // State for selected rows

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
  const { data: roles, isLoading: isRolesLoading } = useRoles();

  const filterConfig = useMemo(() => {
    const filters = [
      {
        key: "department_id",
        label: "Departments",
        options:
          departments?.data?.map((department) => ({
            value: department.id,
            label: department.name,
          })) || [],
        disabled: isDepartmentsLoading,
      },
      {
        key: "role_id",
        label: "Roles",
        options:
          roles?.data?.map((role) => ({
            value: role.id,
            label: role.name,
          })) || [],
        disabled: isRolesLoading,
      },
    ];

    return filters;
  }, [departments, isDepartmentsLoading, roles, isRolesLoading]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "full_name",
        header: "Full Name",
        size: 100,
        cell: (info) => (
          <div className="truncate">
            <strong>{info.getValue()}</strong>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 100,
        cell: (info) => {
          return <div className="truncate">{info.getValue()}</div>;
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        maxSize: 220,
        cell: (info) => {
          const role = info.getValue();
          const roleName = role?.name || "N/A";
          return <div className="truncate">{roleName}</div>;
        },
      },
      {
        accessorKey: "department",
        header: "Department",
        maxSize: 80,
        cell: (info) => {
          const department = info.getValue();
          const departmentCode = department?.department_code || "N/A";
          return <div className="truncate">{departmentCode}</div>;
        },
      },
    ],
    [navigate, handleOpenModal],
  );

  const {
    data: usersData,
    isLoading: loading,
    error,
  } = useUsers(pagination, searchQuery, filters);

  // Extract data from response
  const users = usersData?.data || [];
  const rowCount = usersData?.count || 0;

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading users: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6"></div>
      {/* Bulk actions bar - only show when rows are selected
      {Object.keys(rowSelection).length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md flex items-center justify-between">
          <span className="text-blue-700">
            {Object.keys(rowSelection).length} ticket(s) selected
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRowSelection({})}
            >
              Clear
            </Button>
            <Button size="sm">Bulk Action</Button>
          </div>
        </div>
      )} */}

      <DataTable
        columns={columns}
        data={users}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearch={handleSearch}
        searchPlaceholder="Search by full name or department_code..."
        filters={filters}
        onFiltersChange={handleFiltersChange}
        filterConfig={filterConfig}
        loading={loading}
      />
    </div>
  );
};

export default UsersTable;
