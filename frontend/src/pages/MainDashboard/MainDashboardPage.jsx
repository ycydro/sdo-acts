import React from "react";
import TicketQuantityCard from "../../components/custom/TicketQuantityCard";
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
    <section className="w-screen space-y-5">
      <div className="flex justify-between gap-5">
        {ticketCards.map((card) => (
          <TicketQuantityCard
            key={card.title}
            title={card.title}
            quantity={card.quantity}
          />
        ))}
      </div>
      <div className="flex gap-5 w-full justify-between">
        <OverallSatisfactionPieChart />
        <TicketsByPriorityLineChart />
      </div>
    </section>
  );
};

export default MainDashboardPage;
