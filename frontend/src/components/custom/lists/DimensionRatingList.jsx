import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSQDsWithRatings } from "@/hooks/queries/client-satisfaction/useSQDsWithRatings";

export const DimensionRatingList = () => {
  const { data: response, isLoading } = useSQDsWithRatings();

  // Access the data array from the response
  const dimensionsWithRatings = response?.data || [];

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="p-5 h-[120px] flex-1 rounded-3xl" />
        ))}
      </div>
    );
  }

  // Also add a check for empty data
  if (dimensionsWithRatings.length === 0) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white shadow-md p-5 rounded-3xl flex-1 space-y-4 border text-center">
          <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No dimensions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {dimensionsWithRatings.map((dimension) => (
        <DimensionRatingCard
          key={dimension.dimension_id}
          dimension={dimension.dimension_name}
          rating={parseFloat(dimension.average_rating)}
          responseCount={dimension.response_count}
          weight={dimension.weight}
          code={dimension.dimension_code}
        />
      ))}
    </div>
  );
};

const DimensionRatingCard = ({
  dimension,
  rating,
  responseCount,
  weight,
  code,
}) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.25) return "text-green-600";
    if (rating >= 3.75) return "text-cyan-600";
    if (rating >= 3.0) return "text-yellow-600";
    if (rating >= 2.0) return "text-orange-600";
    return "text-red-600";
  };

  const getWeightColor = (weight) => {
    if (weight >= 1.2) return "bg-blue-100 text-blue-800";
    if (weight >= 1.0) return "bg-green-100 text-green-800";
    if (weight >= 0.8) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white shadow-md p-5 rounded-3xl flex-1 space-y-1 border">
      {/* Header row */}
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm truncate">{code}</span>
          </div>
        </div>
        <Star className="h-5 w-5 text-yellow-500" />
      </div>

      {/* Rating display */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-baseline gap-1">
          <span className={`font-bold text-3xl ${getRatingColor(rating)}`}>
            {rating.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">/ 5.0</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {responseCount} {responseCount === 1 ? "response" : "responses"}
        </div>
      </div>
    </div>
  );
};
