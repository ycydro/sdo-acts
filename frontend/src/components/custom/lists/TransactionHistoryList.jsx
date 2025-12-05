import { Check, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useTransactionHistory } from "@/hooks/queries/ticket/useTransactionHistory";

export const TransactionHistoryList = () => {
  const MAXIMUM_HISTORY_ITEMS = 4;

  const { data: tickets, isLoading } = useTransactionHistory({
    pageIndex: 0,
    pageSize: MAXIMUM_HISTORY_ITEMS,
  });

  return (
    <div className="flex flex-col w-full justify-evenly gap-1 h-full">
      {isLoading ? (
        Array.from({ length: MAXIMUM_HISTORY_ITEMS }).map((_, idx) => (
          <Skeleton
            key={idx}
            className="w-full h-[70px] md:h-[80px] rounded-lg"
          />
        ))
      ) : tickets?.data && tickets.data.length > 0 ? (
        <>
          {tickets.data.map((ticket) => (
            <HistoryItem key={ticket.id} ticket={ticket} />
          ))}
        </>
      ) : (
        <div className="py-6 md:py-7 text-center">
          <div className="bg-gray-100 rounded-full p-3 md:p-4 w-fit mx-auto mb-4">
            <FileText className="w-7 h-7 md:w-8 md:h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium text-sm md:text-base">
            No transaction history
          </p>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Your recent transactions will appear here
          </p>
        </div>
      )}
    </div>
  );
};

const HistoryItem = ({ ticket }) => {
  const updatedAgo = formatDistanceToNow(new Date(ticket.updatedAt), {
    addSuffix: true,
  });

  return (
    <div className="flex items-start w-full py-2 md:py-3">
      {/* Green Icon */}
      <div className="p-2 rounded-full bg-green-100 flex-shrink-0 mr-2 md:mr-3">
        <Check className="text-green-700 w-4 h-4 md:w-5 md:h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-lg p-2.5 md:p-3 border border-gray-100">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-start mb-1 gap-2">
              <p className="font-semibold text-base md:text-lg text-gray-800 truncate">
                {ticket.service.name}
              </p>

              <Badge
                variant="outline"
                className="text-xs md:text-sm px-2 py-0.5 md:px-2.5 md:py-1 border-primary text-green-700 bg-green-50 font-bold whitespace-nowrap"
              >
                {ticket.ticket_code}
              </Badge>
            </div>

            <div className="flex items-center text-gray-500">
              <Clock className="w-3 h-3 mr-1.5" />
              <span className="text-xs md:text-sm whitespace-nowrap">
                Updated {updatedAgo}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
