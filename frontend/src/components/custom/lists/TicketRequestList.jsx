import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTickets } from "@/hooks/queries/ticket/useTickets";
import { statusColors } from "@/lib/constants/statusColors";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";

export const TicketRequestList = () => {
  const { data: tickets, isLoading: isLatestTicketsLoading } = useTickets(
    { pageIndex: 0, pageSize: 6 },
    "",
    {}
  );
  return (
    <div className="flex flex-col gap-5 max-w-full">
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
  const navigate = useNavigate();

  return (
    <div
      key={ticket.id}
      className="group p-4 shadow-md border border-black/30 rounded-lg flex flex-col bg-white hover:bg-gray-50 hover:shadow-lg hover:border-black/50 transition-all duration-200 cursor-pointer h-full min-w-[575px] max-w-[575px]"
      onClick={() => navigate(`/main/tickets/view/${ticket.id}`)}
    >
      {/* Header with ticket code and status */}
      <div className="flex gap-2 items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-base font-semibold text-gray-900">
            {ticket.ticket_code}
          </p>
          <span className="truncate text-sm font-semibold text-gray-500 transition-colors">
            {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
          </span>
        </div>
        <Badge
          className={`px-2 py-1 rounded-full text-xs font-medium truncate ${
            statusColors[ticket.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {ticket.status}
        </Badge>
      </div>

      {/* Brief details section */}
      <div className="text-sm space-y-3 mb-4 flex-grow">
        {/* Service/Department info */}
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Service</p>
          <p className="text-gray-800 line-clamp-1">
            {ticket.service?.name || "No service specified"}
          </p>
        </div>

        {/* Details preview */}
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
          <p
            className="text-gray-700 line-clamp-2 text-sm leading-snug"
            title={ticket.details}
          >
            {ticket.details || "No description provided"}
          </p>
        </div>
      </div>

      {/* Footer with client info and CTA hint */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-auto">
        <div className="text-sm">
          <p className="font-semibold text-gray-800">
            {ticket.client.first_name} {ticket.client.last_name}
          </p>
        </div>
        <div className="text-xs text-gray-500 group-hover:text-blue-700 transition-colors">
          View details →
        </div>
      </div>
    </div>
  );
};
