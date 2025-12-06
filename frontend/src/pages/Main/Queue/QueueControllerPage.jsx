import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Clock,
  Plus,
  Search,
  Pause,
  X,
  SkipForward,
  CheckCircle,
} from "lucide-react";

// ---------------------------
// MOCK DATA
// ---------------------------
const nextQueueMock = [
  {
    ticket: "#104",
    name: "Baby Ama",
    service: "Upgrade",
    time: "5 minutes ago",
  },
  {
    ticket: "#105",
    name: "Stephen Kalibo",
    service: "Upgrade",
    time: "3 minutes ago",
  },
  {
    ticket: "#106",
    name: "Leonie Baldo",
    service: "Upgrade",
    time: "2 minutes ago",
  },
  {
    ticket: "#107",
    name: "John Doe",
    service: "Repair",
    time: "1 minute ago",
  },
];

// ---------------------------
// Next Queue Item Component
// ---------------------------
const NextQueueItem = ({ item }) => (
  <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm bg-gray-100 px-2 py-0.5 rounded">
            {item.ticket}
          </span>
          <span className="text-sm text-muted-foreground">{item.service}</span>
        </div>
        <p className="font-medium text-base">{item.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{item.time}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="h-8 text-xs">
        Preview
      </Button>
    </div>
  </div>
);

export const QueueControllerPage = () => {
  return (
    <div className="min-w-full flex flex-col gap-6">
      {/* MAIN AREA */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-3 border shadow-lg py-4 justify-center">
          <CardHeader className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold">Current Ticket</h2>
            <p className="text-sm text-muted-foreground">Now Serving</p>
          </CardHeader>

          <CardContent className="">
            {/* TICKET NUMBER DISPLAY */}
            <div className="flex flex-col items-center justify-center min-h-[240px] mb-4">
              <p className="text-[120px] font-bold text-green-700 leading-none">
                100
              </p>
              <p className="text-lg text-muted-foreground">Ticket #100</p>
            </div>

            <Separator className="my-4" />

            {/* USER DETAILS */}
            <div className="grid grid-cols-3 gap-6 px-2 py-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <User className="w-4 h-4" /> Customer Name
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="font-medium">Joshua Palero</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Plus className="w-4 h-4" /> Service Type
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="font-medium">Repair</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="w-4 h-4" /> Waiting Time
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="font-medium">12 minutes ago</p>
                </div>
              </div>
            </div>

            <div className="w-full px-2">
              <div
                className="bg-white border rounded-md p-3 text-md text-gray-700 leading-relaxed min-h-[25px] shadow-sm"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                No Details
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-center gap-4 pt-6">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-xl">
                <CheckCircle className="mr-3 w-5 h-5" />
                Complete & Next
              </Button>

              <Button
                variant="outline"
                className="border-2 px-8 py-6 text-lg rounded-xl"
              >
                <SkipForward className="mr-3 w-5 h-5" />
                Skip Ticket
              </Button>

              <Button
                variant="outline"
                className="border-2 border-red-300 text-red-600 hover:bg-red-50 px-8 py-6 text-lg rounded-xl"
              >
                <X className="mr-3 w-5 h-5" />
                Cancel
              </Button>

              <Button
                variant="outline"
                className="border-2 px-8 py-6 text-lg rounded-xl"
              >
                <Pause className="mr-3 w-5 h-5" />
                Pause
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* NEXT QUEUE LIST */}
        <Card className="col-span-1 border shadow-lg justify-center">
          <CardHeader className="">
            <h2 className="text-xl font-bold">Next in Queue</h2>
            <p className="text-sm text-muted-foreground">Upcoming tickets</p>
          </CardHeader>

          <CardContent className="flex flex-col justify-center py-3">
            {/* SEARCH */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search tickets..." className="pl-9" />
            </div>

            {/* QUEUE ITEMS LIST */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[300px]">
              {nextQueueMock.map((item, idx) => (
                <NextQueueItem key={idx} item={item} />
              ))}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between">
              <Button variant="outline" className="px-6">
                Back
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <Card className="border-2 border-green-200 shadow-sm">
          <CardContent className="p-5 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              In Queue
            </p>
            <p className="text-5xl font-bold text-green-700">10</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 shadow-sm">
          <CardContent className="p-5 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Being Served
            </p>
            <p className="text-5xl font-bold text-blue-700">3</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 shadow-sm">
          <CardContent className="p-5 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Average Waiting Time
            </p>
            <p className="text-5xl font-bold text-amber-700">2 min</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QueueControllerPage;
