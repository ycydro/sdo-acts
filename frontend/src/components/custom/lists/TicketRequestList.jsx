import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTickets } from "@/hooks/queries/ticket/useTickets";

export const TicketRequestList = () => {
  const { data: tickets, isLoading: isLatestTicketsLoading } = useTickets(
    { pageIndex: 0, pageSize: 6 },
    "",
    {}
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLatestTicketsLoading ? (
        Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="min-w-[300px] min-h-[100px]" />
        ))
      ) : tickets?.data && tickets.data.length > 0 ? (
        tickets.data.map((ticket) => (
          <TicketRequestCard key={ticket.id} ticket={ticket} />
        ))
      ) : (
        <div>No data available</div>
      )}
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
        <p className="truncate text-lg font-semibold">{ticket.ticket_code}</p>
        <Badge>{ticket.status}</Badge>
      </div>

      <div className="text-sm space-y-2 mb-4">
        {/* <p className="text-xs text-muted-foreground">{ticket.issueType}</p> */}
        <p className="truncate" title={ticket.details}>
          {ticket.details}
        </p>
      </div>

      <div className="flex gap-3 mt-auto text-sm">
        <p className="font-semibold">{ticket.client.first_name}</p>
        {/* <span className="text-gray-500">{ticket.timeAgo}</span> */}
      </div>
    </div>
  );
};
