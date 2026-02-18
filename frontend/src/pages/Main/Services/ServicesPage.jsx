import { useEffect, useState, useMemo } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import BackgroundWrapper from "../../../components/custom/BackgroundWrapper";
import AddServiceModal from "../../../components/custom/modals/Services/AddServiceModal";
import { ServiceList } from "../../../components/custom/lists/ServiceList";
import { useServices } from "../../../hooks/queries/service/useServices";
import SelectFilters from "@/components/custom/SelectFilters";
import { useDepartments } from "@/hooks/queries/department/useDepartments";

const ServicesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const { data, isLoading } = useServices({
    search,
    filters,
  });
  const services = data?.data ?? [];

  const { data: departments, isLoading: isDepartmentsLoading } =
    useDepartments();

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
        key: "priority",
        label: "Priority",
        options: [
          { value: "High", label: "High" },
          { value: "Medium", label: "Medium" },
          { value: "Low", label: "Low" },
        ],
      },
      {
        key: "classification",
        label: "Classification",
        options: [
          { value: "Simple", label: "Simple" },
          { value: "Complex", label: "Complex" },
        ],
      },
    ];

    return filters;
  }, [departments, isDepartmentsLoading]);

  return (
    <BackgroundWrapper>
      <main className="min-w-full flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Services</h2>
          <Button variant="sdo-secondary" onClick={() => setShowAddModal(true)}>
            <Plus />
            Add Service
          </Button>
        </div>
        <div className="mt-8 mb-5 flex items-center justify-between">
          <SelectFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            filterConfig={filterConfig}
          />
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search for service name, department, department code..."
              className="w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </main>
      {/* Service Modal */}
      <ServiceList services={services} />

      <AddServiceModal open={showAddModal} onOpenChange={setShowAddModal} />
    </BackgroundWrapper>
  );
};

export default ServicesPage;
