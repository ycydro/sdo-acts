import ClientFeedbackTable from "@/components/custom/tables/ClientFeedbackTable";
import BackgroundWrapper from "@/components/custom/BackgroundWrapper";
import { DimensionRatingList } from "@/components/custom/lists/DimensionRatingList";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DepartmentSpecificSatisfactionPage() {
  const { user } = useAuth();
  const { departmentID } = useParams();
  const navigate = useNavigate();

  return (
    <main className="min-w-full">
      <Button
        variant="ghost"
        onClick={() => navigate("/main/client-feedbacks")}
        className="mb-3"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Overview
      </Button>

      <DimensionRatingList departmentID={departmentID} />

      <BackgroundWrapper className="mt-2.5">
        <ClientFeedbackTable initialFilters={{ department_id: departmentID }} />
      </BackgroundWrapper>
    </main>
  );
}
