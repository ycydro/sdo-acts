import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import TicketQuantityCard from "../../components/custom/cards/TicketQuantityCard";
import BackgroundWrapper from "../../components/custom/BackgroundWrapper";
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

const TicketsPage = () => {
  return (
    <main className="min-w-full">
      <div className="flex w-full justify-between gap-5">
        {ticketCards.map((card) => (
          <TicketQuantityCard
            key={card.title}
            title={card.title}
            quantity={card.quantity}
          />
        ))}
      </div>
      <BackgroundWrapper className="mt-5"></BackgroundWrapper>
    </main>
  );
};

export default TicketsPage;
