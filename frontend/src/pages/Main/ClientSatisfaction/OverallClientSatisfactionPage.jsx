import ClientFeedbackTable from "@/components/custom/tables/ClientFeedbackTable";
import BackgroundWrapper from "@/components/custom/BackgroundWrapper";
import { DimensionRatingList } from "@/components/custom/lists/DimensionRatingList";
import { DepartmentSatisfactionList } from "@/components/custom/lists/DepartmentSatisfactionList";
import { useDepartmentSatisfactionOverview } from "@/hooks/queries/department/useDepartmentSatisfactionOverview";
import { useAuth } from "@/context/AuthContext";

export default function OverallClientSatisfactionPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Superadmin";

  const { data: departmentData, isLoading } =
    useDepartmentSatisfactionOverview();
  const departments = departmentData?.data || [];

  if (isAdmin) {
    return (
      <main className="min-w-full">
        <BackgroundWrapper>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Department Satisfaction Overview
            </h2>
          </div>

          <DepartmentSatisfactionList
            departments={departments}
            isLoading={isLoading}
          />
        </BackgroundWrapper>
      </main>
    );
  }

  // staff view
  return (
    <main className="min-w-full">
      <DimensionRatingList />

      <BackgroundWrapper className="mt-2.5">
        <ClientFeedbackTable />
      </BackgroundWrapper>
    </main>
  );
}
