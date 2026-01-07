import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTickets } from "@/hooks/queries/ticket/useTickets";
import { statusColors } from "@/lib/constants/statusColors";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, RefreshCcw } from "lucide-react";
import { useDebouncedRefetch } from "@/hooks/useDebouncedRefetch";
import { Button } from "@/components/ui/button";

export const TicketRequestList = () => {
  const {
    data: tickets,
    isLoading: isLatestTicketsLoading,
    refetch,
  } = useTickets({ pageIndex: 0, pageSize: 6 }, "", { status: "In Queue" });

  const { debouncedRefetch, isRefetching } = useDebouncedRefetch(() => {
    return refetch();
  }, 1750);

  const navigate = useNavigate();

  return (
    <Card className="flex-1">
      <CardHeader className="p-4 px-4.5 flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <CardTitle className="text-2xl font-semibold">
            Latest Ticket Request
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={debouncedRefetch}
            className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
            title="Refresh tickets"
          >
            <RefreshCcw
              className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        <button
          onClick={() =>
            navigate(`/main/tickets?status=${encodeURIComponent("In Queue")}`)
          }
          className="flex gap-0.5 items-center text-sm cursor-pointer hover:text-blue-700 transition-colors"
        >
          <p className="text-base">View All</p>
          <ChevronRight className="h-4 w-4" />
        </button>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        {isLatestTicketsLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : tickets?.data && tickets.data.length > 0 ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-2 max-h-[calc(100vh-365px)]">
              <div className="space-y-3">
                {tickets.data.map((ticket) => (
                  <TicketRequestCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>
            {tickets.data.length > 5 && (
              <div className="border-t px-4 py-2 bg-muted/5 text-xs text-muted-foreground text-center">
                Scroll for more tickets ({tickets.data.length} total)
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">No pending tickets!</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              All tickets are currently being processed. New ticket requests
              will appear here.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={debouncedRefetch}
              className="gap-2"
            >
              <p>Refresh</p>
              <RefreshCcw
                className={`cursor-pointer hover:text-primary transition-transform ${
                  isRefetching ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TicketRequestCard = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative p-4 bg-white border hover:bg-gray-50 border-black/30 rounded-lg hover:border-black/50 transition-all duration-200 cursor-pointer"
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
