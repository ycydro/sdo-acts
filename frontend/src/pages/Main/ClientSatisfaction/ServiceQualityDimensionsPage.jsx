import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import AddDepartmentModal from "../../../components/custom/modals/Department/AddDepartmentModal";
import BackgroundWrapper from "../../../components/custom/BackgroundWrapper";
import { SQDLists } from "@/components/custom/lists/SQDList";
import { useSQDs } from "@/hooks/queries/client-satisfaction/useSQDs";
import { DimensionRatingList } from "@/components/custom/lists/DimensionRatingList";

const ServiceQualityDimensionsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, isLoading } = useSQDs();
  const dimensions = data?.data ?? [];

  if (isLoading) return <div>Still Loading</div>;

  return (
    <main className="min-w-full flex flex-col">
      <BackgroundWrapper>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">Service Quality Dimensions</h2>
          <Button variant="sdo-secondary" onClick={() => setShowAddModal(true)}>
            <Plus />
            Add Dimension
          </Button>
        </div>
        <div className="mt-8 mb-5 flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search departments..."
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Total Dimensions:</span>
            <span className="font-semibold text-foreground">
              {dimensions.length}
            </span>
          </div>
        </div>

        {/* Department List */}
        <SQDLists dimensions={dimensions} />
        <AddDepartmentModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
        />
      </BackgroundWrapper>
    </main>
  );
};

export default ServiceQualityDimensionsPage;
