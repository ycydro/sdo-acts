import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Scale } from "lucide-react";

export const SQDLists = ({ dimensions }) => {
  // Safe function to get weight as number
  const getWeightNumber = (weight) => {
    if (typeof weight === "string") {
      return parseFloat(weight);
    }
    return weight || 1.0;
  };

  const getWeightColor = (weight) => {
    const weightNum = getWeightNumber(weight);
    if (weightNum === 1.0) return "bg-blue-100 text-blue-800 border-blue-300";
    if (weightNum > 1.0)
      return "bg-purple-100 text-purple-800 border-purple-300";
    if (weightNum < 1.0) return "bg-gray-100 text-gray-800 border-gray-300";
    return "bg-blue-100 text-blue-800 border-blue-300";
  };

  const getWeightLabel = (weight) => {
    const weightNum = getWeightNumber(weight);
    if (weightNum === 1.0) return "Standard";
    if (weightNum > 1.0) return "High Priority";
    if (weightNum < 1.0) return "Low Priority";
    return "Standard";
  };

  return (
    <div className="space-y-3">
      {dimensions.map((dimension) => {
        const weightNum = getWeightNumber(dimension.weight);

        return (
          <Card
            key={dimension.dimension_id}
            className="w-full border border-border hover:border-primary/30 transition-colors"
          >
            <div className="p-4">
              {/* Header Row */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1"></div>

                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {dimension.dimension_name}
                  </h3>
                </div>

                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {dimension.is_active ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Survey Scenario
                </div>
                <p className="text-sm text-foreground bg-muted/30 p-3 rounded-md border border-border">
                  "{dimension.scenario || "N/A"}"
                </p>
              </div>
              <Badge
                variant="outline"
                className={getWeightColor(dimension.weight)}
              >
                <Scale className="h-3 w-3 mr-1" />
                Weight: {weightNum.toFixed(2)}x -{" "}
                {getWeightLabel(dimension.weight)}
              </Badge>
            </div>
          </Card>
        );
      })}

      {dimensions.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            No Dimensions Found
          </h3>
          <p className="text-sm text-muted-foreground">
            Add your first service quality dimension to get started.
          </p>
        </div>
      )}
    </div>
  );
};
