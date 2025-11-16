import { Badge } from "@/components/ui/badge";

export const TicketRequestList = ({ tickets }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.map((ticket) => (
        <TicketRequestCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

const TicketRequestCard = ({ ticket }) => {
  return (
    <div
      key={ticket.id}
      className="p-4 shadow-md border border-black/50 flex flex-col bg-[#f9f9fa] min-w-[300px]"
    >
      <div className="flex gap-2 items-center justify-between mb-2">
        <p className="truncate text-lg font-semibold">
          Ticket #{ticket.ticketNumber}
        </p>
        <Badge variant={ticket.priority.toLowerCase()}>{ticket.priority}</Badge>
      </div>

      <div className="text-sm space-y-2 mb-4">
        <p className="text-xs text-muted-foreground">{ticket.issueType}</p>
        <p>{ticket.description}</p>
      </div>

      <div className="flex gap-3 mt-auto text-sm">
        <p className="font-semibold">{ticket.client}</p>
        <span className="text-gray-500">{ticket.timeAgo}</span>
      </div>
    </div>
  );
};
