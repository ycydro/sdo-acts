import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users, Calendar, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, subDays, subMonths, subYears } from "date-fns";
import { toast } from "sonner";

export const DepartmentSatisfactionList = ({
  departments,
  isLoading,
  onDateRangeChange,
  dateRange,
}) => {
  const navigate = useNavigate();

  const [isCustomRange, setIsCustomRange] = useState(false);
  const [customDates, setCustomDates] = useState({
    from: dateRange?.startDate ? new Date(dateRange.startDate) : undefined,
    to: dateRange?.endDate ? new Date(dateRange.endDate) : undefined,
  });

  const presetOptions = [
    { label: "Past Week", value: "week" },
    { label: "Past Month", value: "month" },
    { label: "Past 6 Months", value: "sixMonths" },
    { label: "Past Year", value: "year" },
    { label: "Custom Range", value: "custom" },
  ];

  const handlePresetChange = (preset) => {
    if (preset === "custom") {
      setIsCustomRange(true);
      return;
    }

    setIsCustomRange(false);
    const endDate = new Date();
    let startDate = new Date();

    switch (preset) {
      case "week":
        startDate = subDays(endDate, 7);
        break;
      case "month":
        startDate = subMonths(endDate, 1);
        break;
      case "sixMonths":
        startDate = subMonths(endDate, 6);
        break;
      case "year":
        startDate = subYears(endDate, 1);
        break;
    }

    const newDateRange = {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      preset,
    };

    if (onDateRangeChange) {
      onDateRangeChange(newDateRange);
    }

    // reset custom dates when switching to a preset
    setCustomDates({ from: undefined, to: undefined });
  };

  const handleCustomRangeCancel = () => {
    setIsCustomRange(false);

    if (dateRange?.preset === "custom") {
      const endDate = new Date();
      const startDate = subDays(endDate, 7); // default to past week

      const newDateRange = {
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        preset: "week",
      };

      if (onDateRangeChange) {
        onDateRangeChange(newDateRange);
      }
    }

    setCustomDates({ from: undefined, to: undefined });
  };

  const handleCustomDateChange = (type, date) => {
    const updatedDates = { ...customDates, [type]: date };
    setCustomDates(updatedDates);
  };

  const handleCustomRangeApply = () => {
    if (customDates.from && customDates.to) {
      if (customDates.to < customDates.from) {
        toast.error("End date must be after start date");
        return;
      }

      const newDateRange = {
        startDate: format(customDates.from, "yyyy-MM-dd"),
        endDate: format(customDates.to, "yyyy-MM-dd"),
        preset: "custom",
      };

      if (onDateRangeChange) {
        onDateRangeChange(newDateRange);
      }
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[200px] rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Department Satisfaction
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {dateRange
                ? `Showing data from ${format(new Date(dateRange.startDate), "MMM dd, yyyy")} to ${format(new Date(dateRange.endDate), "MMM dd, yyyy")}`
                : "Select a date range to view data"}
            </p>
          </div>

          {!isCustomRange ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={dateRange?.preset || "month"}
                  onValueChange={handlePresetChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="bg-card">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left truncate"
                      >
                        <Calendar className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {customDates.from
                            ? format(customDates.from, "MMM dd, yyyy")
                            : "Start date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={customDates.from}
                        onSelect={(date) =>
                          handleCustomDateChange("from", date)
                        }
                        initialFocus
                        captionLayout="dropdown" // dropdown for year/month
                        fromYear={2020}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left truncate"
                      >
                        <Calendar className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {customDates.to
                            ? format(customDates.to, "MMM dd, yyyy")
                            : "End date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={customDates.to}
                        onSelect={(date) => handleCustomDateChange("to", date)}
                        initialFocus
                        captionLayout="dropdown"
                        fromYear={2020}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCustomRangeApply}
                    disabled={!customDates.from || !customDates.to}
                    className="sm:w-24"
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCustomRangeCancel}
                    className="sm:w-24"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            No Department Data Available
          </h3>
          <p className="text-sm text-muted-foreground">
            No satisfaction ratings have been collected for the selected date
            range.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Department Satisfaction
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Showing data from{" "}
            {format(new Date(dateRange.startDate), "MMM dd, yyyy")}
            {" to "}
            {format(new Date(dateRange.endDate), "MMM dd, yyyy")}
          </p>
        </div>

        {!isCustomRange ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select
                value={dateRange?.preset || "month"}
                onValueChange={handlePresetChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {presetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="bg-card">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left truncate"
                    >
                      <Calendar className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {customDates.from
                          ? format(customDates.from, "MMM dd, yyyy")
                          : "Start date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={customDates.from}
                      onSelect={(date) => handleCustomDateChange("from", date)}
                      initialFocus
                      captionLayout="dropdown" // dropdown for year/month
                      fromYear={2020}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left truncate"
                    >
                      <Calendar className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {customDates.to
                          ? format(customDates.to, "MMM dd, yyyy")
                          : "End date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={customDates.to}
                      onSelect={(date) => handleCustomDateChange("to", date)}
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={2020}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCustomRangeApply}
                  disabled={!customDates.from || !customDates.to}
                  className="sm:w-24"
                >
                  Apply
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCustomRangeCancel}
                  className="sm:w-24"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((department) => (
          <DepartmentSatisfactionCard
            key={department.department_id}
            department={department}
            onClick={() =>
              navigate(
                `/main/client-feedbacks/department/${department.department_id}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
              )
            }
          />
        ))}
      </div>
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
