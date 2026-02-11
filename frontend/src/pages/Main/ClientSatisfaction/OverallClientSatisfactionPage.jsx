import { useState, useEffect } from "react";
import ClientFeedbackTable from "@/components/custom/tables/ClientFeedbackTable";
import BackgroundWrapper from "@/components/custom/BackgroundWrapper";
import { DimensionRatingList } from "@/components/custom/lists/DimensionRatingList";
import { DepartmentSatisfactionList } from "@/components/custom/lists/DepartmentSatisfactionList";
import { useDepartmentSatisfactionOverview } from "@/hooks/queries/department/useDepartmentSatisfactionOverview";
import { useAuth } from "@/context/AuthContext";
import { format, subDays, subMonths, subYears } from "date-fns";
import { Calendar } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OverallClientSatisfactionPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Superadmin";

  const [dateRange, setDateRange] = useState(null);
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [customDates, setCustomDates] = useState({
    from: undefined,
    to: undefined,
  });

  // init with default date range (past week)
  useEffect(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, 7);
    setDateRange({
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      preset: "week",
    });
  }, []);

  const { data: departmentData, isLoading } =
    useDepartmentSatisfactionOverview(dateRange);
  const departments = departmentData?.data || [];

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
      if (dateRange?.preset === "custom") {
        setCustomDates({
          from: new Date(dateRange.startDate),
          to: new Date(dateRange.endDate),
        });
      }
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

    setDateRange(newDateRange);
    setCustomDates({ from: undefined, to: undefined });
  };

  const handleCustomRangeCancel = () => {
    setIsCustomRange(false);

    if (dateRange?.preset === "custom") {
      const endDate = new Date();
      const startDate = subDays(endDate, 7);

      const newDateRange = {
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        preset: "week",
      };

      setDateRange(newDateRange);
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

      setDateRange(newDateRange);
      // setIsCustomRange(false);
    }
  };

  if (!dateRange) {
    return <div>Loading...</div>;
  }

  if (isAdmin) {
    return (
      <main className="min-w-full">
        <BackgroundWrapper>
          <div className="max-w-full">
            <DepartmentSatisfactionList
              departments={departments}
              isLoading={isLoading}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        </BackgroundWrapper>
      </main>
    );
  }

  return (
    <main className="min-w-full">
      <div className="mb-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Client Feedback
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {dateRange
                ? `Showing data from ${format(new Date(dateRange.startDate), "MMM dd, yyyy")} to ${format(new Date(dateRange.endDate), "MMM dd, yyyy")}`
                : "Select a date range to view data"}
            </p>
          </div>

          {/* Date Range Controls */}
          {!isCustomRange ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select
                value={dateRange?.preset || "week"}
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
                        captionLayout="dropdown"
                        fromYear={2020}
                        disabled={(date) => date >= new Date()}
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
                        disabled={(date) => date >= new Date()}
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
      </div>

      <DimensionRatingList dateRange={dateRange} />

      <BackgroundWrapper className="mt-2.5">
        <ClientFeedbackTable dateRange={dateRange} />
      </BackgroundWrapper>
    </main>
  );
}
