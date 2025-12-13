import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import { ChevronRight } from "lucide-react";

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
          <CardHeader className="p-4 px-4.5 flex justify-between items-center">
            <CardTitle className="text-2xl">Latest Ticket Request</CardTitle>
            <button
              onClick={() => navigate("/main/tickets")}
              className="flex gap-0.5 items-center text-sm cursor-pointer hover:text-blue-700 transition-colors"
            >
              <p className="text-base">View All</p>
              <ChevronRight className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent className="flex gap-2 justify-center w-full max-h-[270px] overflow-y-auto">
            <TicketRequestList />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default MainDashboardPage;
