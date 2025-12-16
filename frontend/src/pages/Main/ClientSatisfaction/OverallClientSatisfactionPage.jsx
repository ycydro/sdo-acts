import ClientFeedbackTable from "@/components/custom/tables/ClientFeedbackTable";
import BackgroundWrapper from "@/components/custom/BackgroundWrapper";

export default function OverallClientSatisfactionPage() {
  return (
    <main className="min-w-full">
      <BackgroundWrapper>
        <ClientFeedbackTable />
      </BackgroundWrapper>
    </main>
  );
}
