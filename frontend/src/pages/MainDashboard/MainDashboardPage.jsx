import React from "react";
import TicketQuantityCard from "../../components/custom/TicketQuantityCard";

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
    <section className="w-full">
      <div className="flex justify-center gap-5">
        {ticketCards.map((card) => (
          <TicketQuantityCard
            key={card.title}
            title={card.title}
            quantity={card.quantity}
          />
        ))}
      </div>
    </section>
  );
};

export default MainDashboardPage;
