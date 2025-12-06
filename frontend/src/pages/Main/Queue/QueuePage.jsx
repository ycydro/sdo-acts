import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, Check } from "lucide-react";

const DEPARTMENTS = [
  { key: "ICT", items: ["ICT-1", "ICT-2", "ICT-3", "ICT-4"] },
  { key: "FIN", items: ["FIN-1", "FIN-2", "FIN-3", "FIN-4"] },
  { key: "SDS", items: ["SDS-1", "SDS-2", "SDS-3", "SDS-4"] },
  { key: "RCR", items: ["REC-1", "REC-2", "REC-3", "REC-4"] },
  { key: "ACT", items: ["ACT-1", "ACT-2", "ACT-3", "ACT-4"] },
  { key: "PER", items: ["PER-1", "PER-2", "PER-3", "PER-4"] },
  { key: "HR", items: ["HR-1", "HR-2", "HR-3", "HR-4"] },
  { key: "AS", items: ["AS-1", "AS-2", "AS-3", "AS-4"] },
];

export const QueuePage = () => {
  const [visibleDepartments, setVisibleDepartments] = useState(
    DEPARTMENTS.map((d) => d.key)
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDepartment = (key) => {
    setVisibleDepartments((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  };

  const selectAll = () => {
    setVisibleDepartments(DEPARTMENTS.map((d) => d.key));
  };

  const clearAll = () => {
    setVisibleDepartments([]);
  };

  // Get grid columns and card size based on number of visible departments
  const getLayoutConfig = () => {
    const count = visibleDepartments.length;

    if (count === 0) return { gridCols: "grid-cols-1", cardClass: "h-[75vh]" };
    if (count === 1) return { gridCols: "grid-cols-1", cardClass: "h-[75vh]" };
    if (count === 2) return { gridCols: "grid-cols-2", cardClass: "h-[75vh]" };
    if (count === 3) return { gridCols: "grid-cols-3", cardClass: "h-[75vh]" };
    if (count === 4)
      return {
        gridCols: "grid-cols-2 lg:grid-cols-4",
        cardClass: "h-[37.5vh]",
      };
    if (count === 5 || count === 6)
      return {
        gridCols: "grid-cols-2 lg:grid-cols-3",
        cardClass: "h-[37.5vh]",
      };
    if (count === 7 || count === 8)
      return {
        gridCols: "grid-cols-2 lg:grid-cols-4",
        cardClass: "h-[37.5vh]",
      };
    // For more than 8 departments
    return { gridCols: "grid-cols-2 lg:grid-cols-4", cardClass: "h-[37.5vh]" };
  };

  // Get visible departments in order
  const getVisibleDepartmentsInOrder = () => {
    return DEPARTMENTS.filter((dep) => visibleDepartments.includes(dep.key));
  };

  const visibleCount = visibleDepartments.length;
  const { gridCols, cardClass } = getLayoutConfig();

  return (
    <div className="min-w-full">
      <div className="h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">PROCESSING NOW</h1>

          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Departments</span>
              <span className="bg-green-700 text-white rounded-full h-6 w-6 text-xs flex items-center justify-center">
                {visibleCount}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 top-12 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-[500px]">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-md">
                        Department Filter
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Show or hide departments from the queue display
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAll}
                        className="text-xs px-3 py-1.5 bg-green-100 text-green-800 hover:bg-green-200 rounded-md font-medium"
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearAll}
                        className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* All departments in a grid - no scrolling needed */}
                  <div className="grid grid-cols-4 gap-3">
                    {DEPARTMENTS.map((dep) => {
                      const isSelected = visibleDepartments.includes(dep.key);
                      return (
                        <button
                          key={dep.key}
                          onClick={() => toggleDepartment(dep.key)}
                          className={`
                            flex items-center p-3 rounded-lg border transition-all
                            ${
                              isSelected
                                ? "bg-green-50 border-green-500 text-green-800"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                            }
                          `}
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                              isSelected
                                ? "bg-green-500 border-green-500"
                                : "border-gray-400"
                            }`}
                          >
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 text-white" />
                            )}
                          </div>
                          <span className="font-medium text-xs">{dep.key}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={`grid ${gridCols} gap-2`}>
          {getVisibleDepartmentsInOrder().map((dep) => (
            <Card key={dep.key} className={`${cardClass} flex flex-col`}>
              <CardHeader className="bg-green-700 text-white font-bold py-4 px-4 flex-shrink-0">
                <div className="text-2xl">{dep.key}</div>
              </CardHeader>
              <CardContent className="p-4 flex-grow flex flex-col justify-center">
                <div className="flex h-full items-center">
                  <div className="flex-1 pr-3 border-r border-gray-200 flex flex-col justify-center">
                    <div className="text-xs text-gray-500 mb-2">
                      NOW PROCESSING
                    </div>
                    <div className="text-5xl font-bold text-gray-800 leading-none">
                      {dep.items[0]}
                    </div>
                  </div>

                  {/* Next in Line */}
                  <div className="flex-1 pl-3 flex flex-col justify-center">
                    <div className="text-md text-gray-500 mb-1">
                      NEXT IN LINE
                    </div>
                    <div className="space-y-1">
                      {dep.items.slice(1, 4).map((item) => (
                        <div
                          key={item}
                          className="text-lg text-gray-600 p-2 hover:bg-gray-50 rounded"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {visibleCount === 0 && (
          <div className="items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-6">📋</div>
              <h3 className="text-3xl font-bold text-gray-700 mb-3">
                No Departments Selected
              </h3>
              <p className="text-gray-500 mb-8 text-lg">
                Select departments from the filter to display their queues
              </p>
              <Button onClick={selectAll} size="lg">
                Show All Departments
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueuePage;
