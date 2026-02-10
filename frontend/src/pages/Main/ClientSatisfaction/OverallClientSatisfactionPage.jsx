import { useState, useEffect } from "react";
import ClientFeedbackTable from "@/components/custom/tables/ClientFeedbackTable";
import BackgroundWrapper from "@/components/custom/BackgroundWrapper";
import { DimensionRatingList } from "@/components/custom/lists/DimensionRatingList";
import { DepartmentSatisfactionList } from "@/components/custom/lists/DepartmentSatisfactionList";
import { useDepartmentSatisfactionOverview } from "@/hooks/queries/department/useDepartmentSatisfactionOverview";
import { useAuth } from "@/context/AuthContext";
import { format, subDays, subMonths } from "date-fns";

export default function OverallClientSatisfactionPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Superadmin";

  const [dateRange, setDateRange] = useState(null);

  // init with default date range (past week)
  useEffect(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, 7);
    setDateRange({
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      preset: "week",
    });
  }, []);

  const {
    data: departmentData,
    isLoading,
    refetch,
  } = useDepartmentSatisfactionOverview(dateRange);
  const departments = departmentData?.data || [];

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  if (!dateRange) {
    return <div>Loading...</div>;
  }

  if (isAdmin) {
    return (
      <main className="min-w-full">
        <BackgroundWrapper>
          <div className="max-w-full">
            <DepartmentSatisfactionList
              departments={departments}
              isLoading={isLoading}
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
        </BackgroundWrapper>
      </main>
    );
  }

  return (
    <main className="min-w-full">
      <DimensionRatingList />

      <BackgroundWrapper className="mt-2.5">
        <ClientFeedbackTable />
      </BackgroundWrapper>
    </main>
  );
}
