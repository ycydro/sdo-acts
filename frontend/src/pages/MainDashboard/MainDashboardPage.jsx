import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import TicketQuantityCard from "../../components/custom/cards/TicketQuantityCard";
import OverallSatisfactionPieChart from "../../components/custom/charts/OverallSatisfactionPieChart";
import TicketsByPriorityLineChart from "../../components/custom/charts/TicketsByPriorityLineChart";
import { TicketRequestList } from "../../components/custom/lists/TicketRequestList";

export const initialTicketRequests = [
  {
    id: 1,
    ticketNumber: "0001",
    priority: "Medium",
    issueType: "Laptop Issue",
    description:
      "Bigla nalang namatay yung laptop huling ko nagamit nung nakaraan linggo pa.",
    client: "Joshua P.",
    timeAgo: "8 mins ago",
  },
  {
    id: 2,
    ticketNumber: "0002",
    priority: "High",
    issueType: "Email not working",
    description: "Hindi ako makareceive ng emails since kahapon.",
    client: "Diwata",
    timeAgo: "1 hour ago",
  },
  {
    id: 3,
    ticketNumber: "0003",
    priority: "Low",
    issueType: "Request for software install",
    description: "KAILANGAN KO PHOTOSHOP",
    client: "Peddz",
    timeAgo: "Yesterday",
  },
  {
    id: 4,
    ticketNumber: "0004",
    priority: "High",
    issueType: "Printer not responding",
    description: "Laging offline yung printer kahit naka-connect sa network.",
    client: "Apollos College.",
    timeAgo: "2 hours ago",
  },
];

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

const MainDashboardPage = () => {
  return (
    <main className="min-w-full space-y-5">
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
          <TicketRequestList tickets={initialTicketRequests} />
        </CardContent>
      </Card>
    </main>
  );
};

export default MainDashboardPage;
