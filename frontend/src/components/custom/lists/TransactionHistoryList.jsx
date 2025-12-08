import { Check, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useTransactionHistory } from "@/hooks/queries/ticket/useTransactionHistory";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  const updatedAgo = formatDistanceToNow(new Date(ticket.updatedAt), {
    addSuffix: true,
  });

  return (
    <div
      className="group flex items-start w-full py-2 md:py-3 hover:translate-x-1 transition-transform duration-150 cursor-pointer"
      onClick={() => navigate(`/ticket/${ticket.id}`)}
    >
      <div className="p-1.5 md:p-2 rounded-full bg-green-100 flex-shrink-0 mr-2 md:mr-3 group-hover:bg-green-200 transition-colors">
        <Check className="text-green-700 w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="bg-gray-50 rounded-lg p-2 md:p-2.5 lg:p-3 border border-gray-100 group-hover:bg-white group-hover:border-green-200 group-hover:shadow-sm transition-all duration-150">
          <div className="flex flex-col gap-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-2 mb-1">
              <div className="flex items-center gap-1 min-w-0 overflow-hidden">
                <p className="font-semibold text-sm md:text-base lg:text-lg text-gray-800 truncate group-hover:text-green-800 transition-colors">
                  {ticket.service.name}
                </p>
                <span className="text-gray-400 text-xs sm:text-sm group-hover:text-green-600 transition-colors flex-shrink-0">
                  ›
                </span>
              </div>

              <Badge
                variant="outline"
                className="text-[10px] sm:text-xs md:text-sm px-1.5 sm:px-2 py-0.5 sm:py-0.5 md:px-2.5 md:py-1 border-primary text-green-700 bg-green-50 font-bold whitespace-nowrap self-start sm:self-auto w-fit sm:w-auto"
              >
                {ticket.ticket_code}
              </Badge>
            </div>

            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
              <div className="flex items-center text-gray-500">
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5 flex-shrink-0" />
                <span className="text-[10px] xs:text-xs sm:text-sm whitespace-nowrap truncate">
                  Updated {updatedAgo}
                </span>
              </div>
              <span className="text-[10px] xs:text-xs text-green-600 font-medium group-hover:text-green-700 group-hover:font-bold transition-all xs:self-end sm:self-auto">
                View details ›
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
