import { Ticket } from "lucide-react";
import React from "react";

const TicketQuantityCard = ({ title, quantity }) => {
  return (
    <div className="bg-white shadow-md px-5 py-7 rounded-3xl min-w-100 max-w-100 space-y-4">
      <div className="flex justify-between ">
        <p className="truncate">{title}</p>
        <Ticket className="mr-5" />
      </div>
      <div className="font-bold text-4xl truncate">{quantity}</div>
    </div>
  );
};

export default TicketQuantityCard;
