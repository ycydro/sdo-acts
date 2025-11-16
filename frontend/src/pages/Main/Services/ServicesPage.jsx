import { useEffect, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import BackgroundWrapper from "../../../components/custom/BackgroundWrapper";
import AddServiceModal from "../../../components/custom/modals/Services/AddServiceModal";
import { ServiceList } from "../../../components/custom/lists/ServiceList";
import { useServices } from "../../../hooks/queries/service/useServices";

const ServicesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, isLoading } = useServices();
  const services = data?.data ?? [];

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
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search services..."
              className="w-full"
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
