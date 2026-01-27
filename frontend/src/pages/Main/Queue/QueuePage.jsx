import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Filter,
  ChevronDown,
  Check,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import { useQuery } from "@tanstack/react-query";
import { useDepartments } from "@/hooks/queries/department/useDepartments";
import { queueService } from "@/api/services/queueService";

const fetchQueueData = queueService.getQueuedTicketOfAllDepartments;

export const QueuePage = () => {
  const { socket, isConnected, joinAllDepartments } = useSocket();
  const [showDropdown, setShowDropdown] = useState(false);

  // Store queue states for each department
  const [departmentQueueStates, setDepartmentQueueStates] = useState({});

  useEffect(() => {
    console.log("Current state of queue: ", departmentQueueStates);
  }, [departmentQueueStates]);

  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useDepartments();

  const departments = useMemo(() => {
    if (!departmentsData?.data) return [];
    return departmentsData.data
      .filter((dept) => dept.status === "active")
      .map((dept) => ({
        id: dept.id,
        key: dept.department_code,
        name: dept.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [departmentsData]);

  const [visibleDepartments, setVisibleDepartments] = useState([]);

  useEffect(() => {
    if (departments.length > 0 && visibleDepartments.length === 0) {
      setVisibleDepartments(departments.map((d) => d.key));
    }
  }, [departments]);

  const {
    data: queueData = {},
    refetch,
    isLoading: isLoadingQueue,
  } = useQuery({
    queryKey: ["queue-all-departments"],
    queryFn: fetchQueueData,
    staleTime: 5000,
    refetchInterval: 30000,
  });

  // Initialize queue states from queue data
  useEffect(() => {
    if (queueData.data && Object.keys(queueData.data).length > 0) {
      console.log("Initializing queue states from queue data...");

      const initialStates = {};

      Object.values(queueData.data).forEach((deptData) => {
        const deptId = deptData.department?.id;
        if (deptId && deptData.queueSession) {
          initialStates[deptId] = {
            isActive: deptData.queueSession.is_active,
            currentServingTicketId:
              deptData.queueSession.current_serving_ticket_id,
            timestamp: new Date().toISOString(), // You can add actual timestamp if available
          };
        }
      });

      setDepartmentQueueStates(initialStates);
      console.log("Initial queue states loaded:", initialStates);
    }
  }, [queueData]);

  useEffect(() => {
    if (socket) {
      joinAllDepartments();
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdate = (data) => {
      console.log("Queue update received on monitor:", data);
      refetch();
    };

    socket.on("queue-updated", handleQueueUpdate);

    return () => {
      socket.off("queue-updated", handleQueueUpdate);
    };
  }, [socket, refetch]);

  // Listen for queue state updates
  useEffect(() => {
    if (!socket) return;

    const handleQueueStateUpdate = (data) => {
      console.log("Queue state update received on QueuePage:", data);

      setDepartmentQueueStates((prev) => ({
        ...prev,
        [data.departmentId]: {
          isActive: data.isActive,
          currentServingTicketId: data.currentServingTicketId,
          timestamp: data.timestamp,
        },
      }));
    };

    socket.on("queue-state-updated", handleQueueStateUpdate);

    return () => {
      socket.off("queue-state-updated", handleQueueStateUpdate);
    };
  }, [socket]);

  const toggleDepartment = (key) => {
    setVisibleDepartments((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key],
    );
  };

  const selectAll = () => {
    setVisibleDepartments(departments.map((d) => d.key));
  };

  const clearAll = () => {
    setVisibleDepartments([]);
  };

  const getLayoutConfig = () => {
    const count = visibleDepartments.length;

    if (count <= 1) return { gridCols: "grid-cols-1", cardClass: "h-[75vh]" };
    if (count === 2) return { gridCols: "grid-cols-2", cardClass: "h-[75vh]" };
    if (count === 3 || count === 4)
      return {
        gridCols: "grid-cols-2",
        cardClass: "h-[37.5vh]",
      };
    if (count === 5 || count === 6)
      return {
        gridCols: "grid-cols-3",
        cardClass: "h-[37.5vh]",
      };
    if (count === 7 || count === 8)
      return {
        gridCols: "grid-cols-4",
        cardClass: "h-[37.5vh]",
      };
    return { gridCols: "grid-cols-2 lg:grid-cols-4", cardClass: "h-[37.5vh]" };
  };

  const getDepartmentQueue = (deptKey) => {
    const dept = queueData?.[deptKey];

    // Add debug logging
    console.log(`getDepartmentQueue for ${deptKey}:`, {
      queueData: queueData,
      dept: dept,
      queueSession: dept?.queueSession,
      is_active: dept?.queueSession?.is_active,
      current_serving_ticket_id: dept?.queueSession?.current_serving_ticket_id,
      queuedTicketsCount: dept?.queuedTickets?.length,
    });

    if (!dept) return { serving: null, queue: [], isActive: false };

    const deptId = dept.department?.id;
    const queueState = deptId ? departmentQueueStates[deptId] : null;

    // Check if queue is active - first check queueState, then fallback to API response
    const isActive =
      (queueState && queueState.isActive) ||
      (dept.queueSession && dept.queueSession.is_active);

    console.log(`Queue active check for ${deptKey}:`, {
      queueStateIsActive: queueState?.isActive,
      apiIsActive: dept.queueSession?.is_active,
      finalIsActive: isActive,
    });

    // If queue is not active, show no serving ticket
    if (!isActive) {
      return {
        serving: null,
        queue: dept.queuedTickets || [],
        isActive: false,
      };
    }

    // Get current serving ticket ID from multiple sources
    const currentServingTicketId =
      (queueState && queueState.currentServingTicketId) ||
      dept.queueSession?.current_serving_ticket_id;

    console.log(
      `Current serving ticket for ${deptKey}:`,
      currentServingTicketId,
    );

    // If queue is active, find the ticket matching currentServingTicketId
    const servingTicket =
      dept.queuedTickets?.find((t) => t.id === currentServingTicketId) || null;

    // Remaining queue excludes the serving ticket
    const remainingQueue =
      dept.queuedTickets?.filter((t) => t.id !== currentServingTicketId) || [];

    console.log(`Result for ${deptKey}:`, {
      servingTicket: servingTicket?.ticket_code,
      remainingQueueCount: remainingQueue.length,
      isActive: true,
    });

    return {
      serving: servingTicket,
      queue: remainingQueue,
      isActive: true,
    };
  };

  const getVisibleDepartmentsInOrder = () => {
    return departments.filter((dep) => visibleDepartments.includes(dep.key));
  };

  const visibleCount = visibleDepartments.length;
  const { gridCols, cardClass } = getLayoutConfig();

  if (isLoadingDepartments) {
    return (
      <div className="min-w-full h-full flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-full">
      <div className="h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">PROCESSING NOW</h1>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Wifi className="w-4 h-4" />
                <span>Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <WifiOff className="w-4 h-4" />
                <span>Offline</span>
              </div>
            )}

            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2"
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
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={selectAll}
                          className="text-xs px-3 py-1.5 bg-primary text-white hover:bg-primary/80 rounded-md font-medium cursor-pointer"
                        >
                          Select All
                        </button>
                        <button
                          onClick={clearAll}
                          className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-medium cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    <div
                      className={`grid ${
                        departments.length <= 4
                          ? "grid-cols-2"
                          : departments.length <= 6
                            ? "grid-cols-3"
                            : "grid-cols-4"
                      } gap-3`}
                    >
                      {departments.map((dep) => {
                        const isSelected = visibleDepartments.includes(dep.key);
                        return (
                          <button
                            key={dep.id}
                            onClick={() => toggleDepartment(dep.key)}
                            className={`
                              flex items-center p-3 rounded-lg border transition-all cursor-pointer
                              ${
                                isSelected
                                  ? "bg-green-50 border-primary text-green-800"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                              }
                            `}
                            title={dep.name}
                          >
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center mr-3 flex-shrink-0 ${
                                isSelected
                                  ? "bg-primary border-primary"
                                  : "border-gray-400"
                              }`}
                            >
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-white" />
                              )}
                            </div>
                            <span className="font-medium text-xs truncate">
                              {dep.key}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {departments.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No active departments found
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {isLoadingQueue ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Loading queue data...</p>
            </div>
          </div>
        ) : (
          <div className={`grid ${gridCols} gap-2`}>
            {getVisibleDepartmentsInOrder().map((dep) => {
              const { serving, queue, isActive } = getDepartmentQueue(dep.key);

              return (
                <Card key={dep.id} className={`${cardClass} flex flex-col`}>
                  <CardHeader className="bg-green-700 text-white font-bold py-4 px-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl">{dep.key}</div>
                        <div className="text-xl font-normal opacity-90 truncate">
                          {dep.name}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow flex flex-col justify-center">
                    <div className="flex h-full items-center">
                      <div className="flex-1 pr-3 border-r border-gray-200 flex flex-col justify-center">
                        <div className="text-xs text-gray-500 mb-2">
                          NOW PROCESSING
                        </div>
                        {serving ? (
                          <>
                            <div className="text-5xl font-bold text-gray-800 leading-none">
                              {serving.ticket_code}
                            </div>
                            <div className="text-sm text-gray-600 mt-2 truncate">
                              {serving.client?.first_name}{" "}
                              {serving.client?.last_name}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-5xl font-bold text-gray-400 leading-none">
                              ---
                            </div>
                            <div className="text-sm text-gray-400 mt-2 italic">
                              {queue.length > 0
                                ? "Queue not started"
                                : "No tickets"}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex-1 pl-3 flex flex-col justify-center">
                        <div className="text-md text-gray-500 mb-1">
                          NEXT IN LINE
                        </div>
                        <div className="space-y-1">
                          {queue.length > 0 ? (
                            queue.slice(0, 3).map((ticket) => (
                              <div
                                key={ticket.id}
                                className="text-lg text-gray-600 p-2 hover:bg-gray-50 rounded"
                              >
                                {ticket.ticket_code}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-400 italic">
                              No tickets waiting
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {visibleCount === 0 && !isLoadingQueue && (
          <div className="flex items-center justify-center h-[60vh]">
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

        {departments.length === 0 && !isLoadingDepartments && (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-700 mb-3">
                No Departments Available
              </h3>
              <p className="text-gray-500 text-lg">
                No active departments found in the system
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueuePage;
