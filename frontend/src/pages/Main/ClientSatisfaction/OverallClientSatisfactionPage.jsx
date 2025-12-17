import ClientFeedbackTable from "@/components/custom/tables/ClientFeedbackTable";
import BackgroundWrapper from "@/components/custom/BackgroundWrapper";
import { DimensionRatingList } from "@/components/custom/lists/DimensionRatingList";

export default function OverallClientSatisfactionPage() {
  return (
    <main className="min-w-full">
      <DimensionRatingList />

      <BackgroundWrapper className="mt-2.5">
        <ClientFeedbackTable />
      </BackgroundWrapper>
    </main>
  );
}
