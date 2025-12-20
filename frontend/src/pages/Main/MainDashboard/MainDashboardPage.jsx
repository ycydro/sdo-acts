import React from "react";

import { TicketRequestList } from "../../../components/custom/lists/TicketRequestList";
import { TicketStatusCountList } from "@/components/custom/lists/TicketStatusCountList";
import { useNavigate } from "react-router";
import { TicketsWithNewCommentsList } from "@/components/custom/lists/TicketsWithNewCommentsList";

const MainDashboardPage = () => {
  const navigate = useNavigate();
  return (
    <main className="min-w-full space-y-5">
      <TicketStatusCountList />
      {/* CHARTS */}
      <div className="flex gap-5 w-full justify-between">
        <TicketRequestList />
        <TicketsWithNewCommentsList />
      </div>
    </main>
  );
};

export default MainDashboardPage;
