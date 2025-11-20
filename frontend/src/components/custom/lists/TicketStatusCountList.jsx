import { useTicketStatusCount } from "@/hooks/queries/ticket/useTicketStatusCount";
import { Ticket } from "lucide-react";
import { LoaderIcon } from "lucide-react";

export const TicketStatusCountList = () => {
  const { data: statusCounts, isLoading: isStatusCountLoading } =
    useTicketStatusCount();
  return (
    <div className="w-full">
      {isStatusCountLoading ? (
        <div className="flex justify-center items-center w-full">
          <LoaderIcon className="animate-spin w-10 h-10 text-primary" />
        </div>
      ) : statusCounts?.data && Object.keys(statusCounts.data).length > 0 ? (
        <div className="flex justify-between gap-5">
          {Object.entries(statusCounts.data).map(([status, count]) => (
            <TicketStatusCount key={status} status={status} count={count} />
          ))}
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

const TicketStatusCount = ({ status, count }) => {
  return (
    <div className="bg-white shadow-md p-5 rounded-3xl flex-1 space-y-4">
      <div className="flex justify-between ">
        <p className="truncate">{status}</p>
        <Ticket className="mr-5" />
      </div>
      <div className="font-bold text-3xl truncate">{count}</div>
    </div>
  );
};
