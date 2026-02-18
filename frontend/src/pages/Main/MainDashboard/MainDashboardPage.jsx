import React from "react";

import { TicketRequestList } from "../../../components/custom/lists/TicketRequestList";
import { TicketStatusCountList } from "@/components/custom/lists/TicketStatusCountList";
import { useNavigate } from "react-router";
import { TicketsWithNewCommentsList } from "@/components/custom/lists/TicketsWithNewCommentsList";

const MainDashboardPage = () => {
  const navigate = useNavigate();
  return (
    <main className="min-w-full h-full space-y-5 flex flex-col">
      <TicketStatusCountList />
      {/* CHARTS */}
      <div className="flex gap-5 w-full flex-1 min-h-0">
        <TicketRequestList />
        <TicketsWithNewCommentsList />
      </div>
    </main>
  );
};

export default MainDashboardPage;
