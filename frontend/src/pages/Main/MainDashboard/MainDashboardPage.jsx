import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import OverallSatisfactionPieChart from "../../../components/custom/charts/OverallSatisfactionPieChart";
import TicketsByPriorityLineChart from "../../../components/custom/charts/TicketsByPriorityLineChart";
import { TicketRequestList } from "../../../components/custom/lists/TicketRequestList";
import { useTickets } from "@/hooks/queries/ticket/useTickets";
import { TicketStatusCountList } from "@/components/custom/lists/TicketStatusCountList";

const MainDashboardPage = () => {
  const { data: tickets, isLoading } = useTickets(
    { pageIndex: 0, pageSize: 23 },
    "",
    {}
  );

  return (
    <main className="min-w-full space-y-5">
      <TicketStatusCountList />
      {/* CHARTS */}
      <div className="flex gap-5 w-full justify-between">
        <OverallSatisfactionPieChart />
        <TicketsByPriorityLineChart />
      </div>
      {/* LATEST TICKET REQUEST */}
      <Card className="px-4 pb-10 w-full">
        <CardHeader className="p-4">
          <CardTitle className="text-2xl">Latest Ticket Request</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 justify-center w-full max-h-[270px] overflow-y-auto">
          {isLoading ? (
            <div>Ticket still loading</div>
          ) : (
            <TicketRequestList tickets={tickets?.data} />
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default MainDashboardPage;
