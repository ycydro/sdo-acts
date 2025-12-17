import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSQDs } from "@/hooks/queries/client-satisfaction/useSQDs";

// Mock rating generator for each dimension
const generateMockRatings = (dimensions) => {
  return dimensions.map((dimension) => {
    // Generate random rating between 1-5
    const rating = (Math.random() * 4 + 1).toFixed(1);
    const weight =
      typeof dimension.weight === "string"
        ? parseFloat(dimension.weight)
        : dimension.weight;

    return {
      ...dimension,
      average_rating: parseFloat(rating),
      response_count: Math.floor(Math.random() * 100) + 10,
      weight,
    };
  });
};

export const DimensionRatingList = () => {
  const { data: response, isLoading } = useSQDs();

  // Access the data array from the response
  const dimensions = response?.data || [];
  const dimensionRatings = generateMockRatings(dimensions);

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
  if (dimensions.length === 0) {
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
      {dimensionRatings.map((dimension) => (
        <DimensionRatingCard
          key={dimension.dimension_id}
          dimension={dimension.dimension_name}
          rating={dimension.average_rating}
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

  return (
    <div className="bg-white shadow-md p-5 rounded-3xl flex-1 space-y-4 cursor-pointer border">
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
      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className={`font-bold text-3xl ${getRatingColor(rating)}`}>
            {rating.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">/ 5.0</span>
        </div>
      </div>
    </div>
  );
};
