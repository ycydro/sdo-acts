import BackgroundWrapper from "../../../components/custom/BackgroundWrapper";
import TicketsTable from "../../../components/custom/tables/TicketsTable";
import { TicketStatusCountList } from "@/components/custom/lists/TicketStatusCountList";
import { useSearchParams } from "react-router-dom"; // Add this import

const TicketsPage = () => {
  const [searchParams] = useSearchParams();

  return (
    <main className="min-w-full">
      <TicketStatusCountList />
      <BackgroundWrapper className="mt-5">
        <TicketsTable
          initialFilters={
            searchParams.get("status")
              ? { status: searchParams.get("status") }
              : {}
          }
        />
      </BackgroundWrapper>
    </main>
  );
};

export default TicketsPage;
