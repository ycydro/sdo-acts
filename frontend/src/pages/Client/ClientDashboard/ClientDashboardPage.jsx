import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, History, Ticket } from "lucide-react";

const ClientDashboardPage = () => {
  return (
    <main className="w-full space-y-5">
      <h2 className="hidden text-3xl font-semibold lg:block">Quick Actions</h2>
      {/* CTA */}
      <div className="flex lg:grid lg:grid-cols-2 gap-6 overflow-x-auto md:overflow-visible px-1 md:px-0">
        <Card className="min-w-full flex-shrink-0 md:flex-shrink md:min-w-0 text-center shadow-lg border border-gray-200 flex flex-col justify-center p-6">
          <CardContent className="flex flex-col justify-center items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Plus className="text-green-800 w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <p className="text-xl font-bold">Create New Ticket</p>
              <p className="text-gray-600 text-sm">Submit service request</p>
            </div>

            <Button className="bg-green-700 hover:bg-green-800 text-white font-semibold text-base px-5 py-2 rounded-full w-full">
              Create Ticket
            </Button>
          </CardContent>
        </Card>

        <Card className="min-w-full flex-shrink-0 md:flex-shrink md:min-w-0 text-center shadow-lg border border-gray-200 flex flex-col justify-center p-6">
          <CardContent className="flex flex-col justify-center items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <History className="text-green-800 w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <p className="text-xl font-bold">Ticket History</p>
              <p className="text-gray-600 text-sm">
                View all your previous service requests
              </p>
            </div>

            <Button className="bg-green-700 hover:bg-green-800 text-white font-semibold text-base px-5 py-2 rounded-full w-full">
              View History
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* TICKET INFOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-1">
        <Card className="min-w-full flex-shrink-0 lg:col-span-2 text-center shadow-lg border border-gray-200 p-6">
          <CardHeader className="flex items-center justify-center gap-3 w-full">
            <div className="bg-green-100 p-3 rounded-full w-fit">
              <History className="text-green-800 w-8 h-8" />
            </div>
            <p className="text-2xl font-semibold">Transaction History</p>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center gap-4"></CardContent>
        </Card>

        <Card className="min-w-full flex-shrink-0 md:flex-shrink md:min-w-0 text-center shadow-lg border border-gray-200 flex flex-col justify-center p-6">
          <CardHeader className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center justify-center w-full gap-3">
              <div className="bg-green-100 p-3 rounded-full w-fit">
                <Ticket className="text-green-800 w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">Active Ticket</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center gap-4"></CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ClientDashboardPage;
