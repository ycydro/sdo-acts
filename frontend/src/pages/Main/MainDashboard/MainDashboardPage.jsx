import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import OverallSatisfactionPieChart from "../../../components/custom/charts/OverallSatisfactionPieChart";
import TicketsByPriorityLineChart from "../../../components/custom/charts/TicketsByPriorityLineChart";
import { TicketRequestList } from "../../../components/custom/lists/TicketRequestList";
import { TicketStatusCountList } from "@/components/custom/lists/TicketStatusCountList";
import { useNavigate } from "react-router";

const MainDashboardPage = () => {
  const navigate = useNavigate();
  return (
    <main className="min-w-full space-y-5">
      <TicketStatusCountList />
      {/* CHARTS */}
      <div className="flex gap-5 w-full justify-between">
        <OverallSatisfactionPieChart />
        <Card className="flex-1">
          <CardHeader className="p-4">
            <CardTitle className="text-2xl">Latest Ticket Request</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 justify-center w-full max-h-[270px] overflow-y-auto">
            <TicketRequestList />
          </CardContent>
          <CardFooter className="p-4 flex justify-end items-center">
            <button
              onClick={() => navigate("/main/tickets")}
              className="text-sm cursor-pointer hover:text-blue-700 transition-colors"
            >
              View All →
            </button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default MainDashboardPage;
