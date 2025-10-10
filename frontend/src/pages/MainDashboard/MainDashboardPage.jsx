import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import TicketQuantityCard from "../../components/custom/cards/TicketQuantityCard";
import TicketRequestCard from "../../components/custom/cards/TicketRequestCard";
import BackgroundWrapper from "../../components/custom/BackgroundWrapper";
import OverallSatisfactionPieChart from "../../components/custom/charts/OverallSatisfactionPieChart";
import TicketsByPriorityLineChart from "../../components/custom/charts/TicketsByPriorityLineChart";

const MainDashboardPage = () => {
  const ticketCards = [
    {
      title: "Unapproved Tickets",
      quantity: 500,
    },
    {
      title: "Pending Tickets",
      quantity: 300,
    },
    {
      title: "Open Tickets",
      quantity: 500,
    },
    {
      title: "Resolved Tickets",
      quantity: 100000,
    },
  ];

  return (
    <section className="min-w-full space-y-5">
      <div className="flex w-full justify-between gap-5">
        {ticketCards.map((card) => (
          <TicketQuantityCard
            key={card.title}
            title={card.title}
            quantity={card.quantity}
          />
        ))}
      </div>
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
          <TicketRequestCard
            ticketNumber={30}
            priority="medium"
            issueType="Nahulog sa kanal"
            description="Nalagyan tubig yung laptop"
            client="John Fred"
            timeAgo="8 mins ago"
          />
          <TicketRequestCard
            ticketNumber={30}
            priority="medium"
            issueType="Nahulog sa kanal"
            description="Nalagyan tubig yung laptop"
            client="John Fred"
            timeAgo="8 mins ago"
          />
          <TicketRequestCard
            ticketNumber={30}
            priority="medium"
            issueType="Nahulog sa kanal"
            description="Nalagyan tubig yung laptop"
            client="John Fred"
            timeAgo="8 mins ago"
          />
          <TicketRequestCard
            ticketNumber={30}
            priority="medium"
            issueType="Nahulog sa kanal"
            description="Nalagyan tubig yung laptop"
            client="John Fred"
            timeAgo="8 mins ago"
          />
          <TicketRequestCard
            ticketNumber={30}
            priority="medium"
            issueType="Nahulog sa kanal"
            description="Nalagyan tubig yung laptop"
            client="John Fred"
            timeAgo="8 mins ago"
          />
          <TicketRequestCard
            ticketNumber={30}
            priority="medium"
            issueType="Nahulog sa kanal"
            description="Nalagyan tubig yung laptop"
            client="John Fred"
            timeAgo="8 mins ago"
          />
          <TicketRequestCard
            ticketNumber={30}
            priority="medium"
            issueType="Nahulog sa kanal"
            description="Nalagyan tubig yung laptop"
            client="John Fred"
            timeAgo="8 mins ago"
          />
          <TicketRequestCard
            ticketNumber={30}
            priority="medium"
            issueType="Nahulog sa kanal"
            description="Nalagyan tubig yung laptop"
            client="John Fred"
            timeAgo="8 mins ago"
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default MainDashboardPage;
