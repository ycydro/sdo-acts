import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export const DepartmentSatisfactionList = ({ departments, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-[200px] rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium text-foreground mb-1">
          No Department Data Available
        </h3>
        <p className="text-sm text-muted-foreground">
          No satisfaction ratings have been collected yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((department) => (
        <DepartmentSatisfactionCard
          key={department.department_id}
          department={department}
          onClick={() =>
            navigate(
              `/main/client-feedbacks/department/${department.department_id}`,
            )
          }
        />
      ))}
    </div>
  );
};

const DepartmentSatisfactionCard = ({ department, onClick }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.25) return "text-green-600";
    if (rating >= 3.75) return "text-cyan-600";
    if (rating >= 3.0) return "text-yellow-600";
    if (rating >= 2.0) return "text-orange-600";
    return "text-red-600";
  };

  const getRatingBgColor = (rating) => {
    if (rating >= 4.25) return "bg-green-50";
    if (rating >= 3.75) return "bg-cyan-50";
    if (rating >= 3.0) return "bg-yellow-50";
    if (rating >= 2.0) return "bg-orange-50";
    return "bg-red-50";
  };

  const averageRating = parseFloat(department.average_rating || 0);
  const responseCount = parseInt(department.response_count || 0);

  return (
    <Card
      className="border border-primary/50 hover:shadow-lg cursor-pointer transition-all hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex gap-2 items-center flex-1 min-w-0">
            <Badge variant="default" className="py-1 text-xs">
              {department.department_code}
            </Badge>
            <h3 className="text-md font-semibold text-card-foreground truncate">
              {department.department_name}
            </h3>
          </div>
        </div>

        {/* Rating Display */}
        <div
          className={`${getRatingBgColor(averageRating)} rounded-2xl p-4 mb-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span
                className={`font-bold text-4xl ${getRatingColor(averageRating)}`}
              >
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/ 5.0</span>
            </div>
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Total Responses</span>
            </div>
            <span className="font-semibold text-foreground">
              {responseCount}
            </span>
          </div>
        </div>

        {/* Click indicator */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Click to view detailed feedback
          </p>
        </div>
      </div>
    </Card>
  );
};
