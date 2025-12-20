import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { statusColors } from "@/lib/constants/statusColors";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";
import {
  MessageSquare,
  Eye,
  Clock,
  User,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useTicketsWithNewComments } from "@/hooks/queries/ticket/comments/useTicketWithNewComments";
import { ticketsService } from "@/api/services/ticketsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TicketsWithNewCommentsList = () => {
  const { data, isLoading, refetch } = useTicketsWithNewComments();
  const [markedTickets, setMarkedTickets] = useState(new Set());
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const handleMarkAllAsSeen = async () => {
    if (!data?.data || isMarkingAll) return;

    const ticketIds = data.data.map((ticket) => ticket.id);

    try {
      setIsMarkingAll(true);
      setMarkedTickets(new Set(ticketIds));

      await ticketsService.markMultipleCommentsAsSeen(ticketIds);

      // Wait for animation then refetch
      setTimeout(() => {
        refetch();
        setMarkedTickets(new Set());
        setIsMarkingAll(false);
      }, 800);
    } catch (error) {
      console.error("Failed to mark comments as seen:", error);
      setMarkedTickets(new Set());
      setIsMarkingAll(false);
      refetch();
    }
  };

  const visibleTickets =
    data?.data?.filter((ticket) => !markedTickets.has(ticket.id)) || [];

  return (
    <Card className="flex-1">
      <CardHeader className="p-4 px-4.5 flex justify-between items-center">
        <div className="flex justify-center items-center">
          <CardTitle className="text-2xl font-semibold">New Comments</CardTitle>
          {data?.count ? (
            <Badge className="ml-2 bg-red-500 hover:bg-red-600">
              {data.count}
            </Badge>
          ) : null}
        </div>
        {visibleTickets.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsSeen}
            disabled={isMarkingAll}
            className="h-8 gap-2"
          >
            {isMarkingAll ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Marking...
              </>
            ) : (
              <>
                <Eye className="h-3 w-3" />
                Mark All as Seen
              </>
            )}
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : visibleTickets.length > 0 ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-2 max-h-[calc(100vh-365px)]">
              <div className="space-y-3">
                {visibleTickets.map((ticket) => (
                  <TicketWithNewCommentsCard
                    key={ticket.id}
                    ticket={ticket}
                    onMarkAsSeen={(ticketID) => {
                      setMarkedTickets((prev) => new Set([...prev, ticketID]));
                    }}
                  />
                ))}
              </div>
            </div>
            {visibleTickets.length > 5 && (
              <div className="border-t px-4 py-2 bg-muted/5 text-xs text-muted-foreground text-center">
                Scroll for more tickets ({visibleTickets.length} total)
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">All caught up!</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              No tickets with new comments. When someone comments on a ticket
              you're involved with, it will appear here.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
            >
              Refresh
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TicketWithNewCommentsCard = ({ ticket, onMarkAsSeen }) => {
  const navigate = useNavigate();
  const [isMarking, setIsMarking] = useState(false);

  const handleViewTicket = async (e) => {
    e?.stopPropagation();
    if (isMarking) return;

    try {
      setIsMarking(true);
      await ticketsService.markCommentsAsSeen(ticket.id);
      onMarkAsSeen(ticket.id);
      navigate(`/main/tickets/view/${ticket.id}#comments`);
    } catch (error) {
      console.error("Failed to mark comments as seen:", error);
      setIsMarking(false);
    }
  };

  const handleMarkAsSeen = async (e) => {
    e.stopPropagation();
    if (isMarking) return;

    try {
      setIsMarking(true);
      await ticketsService.markCommentsAsSeen(ticket.id);
      onMarkAsSeen(ticket.id);
    } catch (error) {
      console.error("Failed to mark comments as seen:", error);
      setIsMarking(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(ticket.createdAt), {
    addSuffix: true,
  });

  const getUserInitials = (user) => {
    if (!user) return "U";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const commenterInitials = ticket.latestComment?.user
    ? getUserInitials(ticket.latestComment.user)
    : "U";

  return (
    <div
      className="group relative p-4 bg-white border hover:bg-gray-50 border-black/30 rounded-lg hover:border-black/50 transition-all duration-200 cursor-pointer"
      onClick={handleViewTicket}
    >
      {/* Loading overlay */}
      {isMarking && (
        <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center z-10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}

      {/* New Comments Badge */}
      <div className="absolute -top-2 -right-2 z-20">
        <Badge className="bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 text-xs font-bold gap-1 animate-pulse">
          <MessageSquare className="h-2.5 w-2.5" />
          {ticket.newCommentCount}
        </Badge>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="truncate text-base font-semibold text-gray-900">
              {ticket.ticket_code}
            </p>
            <Badge
              className={`px-2 py-1 rounded-full text-xs font-medium truncate ${
                statusColors[ticket.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {ticket.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {ticket.service?.name}
          </p>
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
          <Clock className="h-3 w-3" />
          {timeAgo}
        </span>
      </div>

      {/* Comment Preview */}
      {ticket.latestComment && (
        <div className="mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-3 hover:border-blue-200 transition-colors">
            {/* Commenter info */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-800 flex-shrink-0">
                {commenterInitials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {ticket.latestComment.user?.first_name}{" "}
                  {ticket.latestComment.user?.last_name}
                </p>
                {ticket.latestComment.user?.department && (
                  <p className="text-xs text-gray-500 truncate">
                    {ticket.latestComment.user.department}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {formatDistanceToNow(new Date(ticket.latestComment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Comment content */}
            <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed pl-1">
              {ticket.latestComment.content}
            </p>
          </div>
        </div>
      )}
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-800">
            {getUserInitials(ticket.client)}
          </div>
          <div className="text-sm">
            <p className="font-medium truncate max-w-[100px]">
              {ticket.client.first_name} {ticket.client.last_name}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAsSeen}
            disabled={isMarking}
            className="h-7 px-2 text-sm flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            <span>Mark as Seen</span>
          </Button>

          <div className="h-4 w-px bg-border"></div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewTicket}
            disabled={isMarking}
            className="h-7 px-2 text-sm flex items-center gap-1"
          >
            <span>View</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
