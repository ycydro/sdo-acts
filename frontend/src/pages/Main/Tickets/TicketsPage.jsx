import BackgroundWrapper from "../../../components/custom/BackgroundWrapper";
import TicketsTable from "../../../components/custom/tables/TicketsTable";
import { TicketStatusCountList } from "@/components/custom/lists/TicketStatusCountList";

const TicketsPage = () => {
  return (
    <main className="min-w-full">
      <TicketStatusCountList />
      <BackgroundWrapper className="mt-5">
        <TicketsTable />
      </BackgroundWrapper>
    </main>
  );
};

export default TicketsPage;
