import { Skeleton } from "@/components/ui/skeleton";
import { useTicketStatusCount } from "@/hooks/queries/ticket/useTicketStatusCount";
import { Ticket } from "lucide-react";
import { LoaderIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import clsx from "clsx";

export const TicketStatusCountList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: statusCounts, isLoading: isStatusCountLoading } =
    useTicketStatusCount();

  const queryParams = new URLSearchParams(location.search);
  const currentStatus = queryParams.get("status");

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
            isActive={currentStatus === status}
            onClick={() => {
              navigate(`/main/tickets?status=${encodeURIComponent(status)}`);
            }}
          />
        ))
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

const TicketStatusCount = ({ status, count, isActive, onClick }) => {
  return (
    <div
      className={clsx(
        "bg-white shadow-md p-5 rounded-3xl flex-1 space-y-4 cursor-pointer border transition-all duration-200 hover:border-primary",
        isActive && "border-primary border-1 !bg-primary",
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <p
          className={clsx(
            "truncate font-medium",
            isActive && "text-white font-semibold",
          )}
        >
          {status}
        </p>
        <Ticket className={clsx("mr-5", isActive && "text-white")} />
      </div>
      <div
        className={clsx(
          "font-bold text-3xl truncate",
          isActive && "text-white",
        )}
      >
        {count}
      </div>
    </div>
  );
};
