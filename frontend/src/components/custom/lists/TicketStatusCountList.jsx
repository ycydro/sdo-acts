import { Skeleton } from "@/components/ui/skeleton";
import { useTicketStatusCount } from "@/hooks/queries/ticket/useTicketStatusCount";
import { Ticket } from "lucide-react";
import { LoaderIcon } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add this import

export const TicketStatusCountList = () => {
  const navigate = useNavigate(); // Add this hook
  const { data: statusCounts, isLoading: isStatusCountLoading } =
    useTicketStatusCount();

  return (
    <div className="w-full flex justify-between gap-5">
      {isStatusCountLoading ? (
        Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="p-5 h-[90px] flex-1" />
        ))
      ) : statusCounts?.data && Object.keys(statusCounts.data).length > 0 ? (
        Object.entries(statusCounts.data).map(([status, count]) => (
          <TicketStatusCount
            key={status}
            status={status}
            count={count}
            onClick={() =>
              // add search query param
              navigate(`/main/tickets?status=${encodeURIComponent(status)}`)
            }
          />
        ))
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

const TicketStatusCount = ({ status, count, onClick }) => {
  return (
    <div
      className="bg-white shadow-md p-5 rounded-3xl flex-1 space-y-4 cursor-pointer border transition-all duration-200 hover:border-primary
      "
      onClick={onClick}
    >
      <div className="flex justify-between">
        <p className="truncate">{status} Tickets</p>
        <Ticket className="mr-5" />
      </div>
      <div className="font-bold text-3xl truncate">{count}</div>
    </div>
  );
};
