import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  History,
  Ticket,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { statusColors } from "@/lib/constants/statusColors";

const ClientDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full space-y-5">
      <h2 className="hidden text-3xl font-semibold lg:block">Quick Actions</h2>
      {/* CTA */}
      <div className="flex md:grid md:grid-cols-2 gap-6 overflow-x-auto md:overflow-visible px-1 md:px-0">
        <Card className="min-w-full flex-shrink-0 md:flex-shrink md:min-w-0 text-center shadow-lg border border-gray-200 flex flex-col justify-center p-6">
          <CardContent className="flex flex-col justify-center items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Plus className="text-green-800 w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <p className="text-xl font-bold">Request a Service</p>
              <p className="text-gray-600 text-sm">
                Click below to proceed to the official service request form.
              </p>
            </div>

            <Button
              onClick={() => navigate("/request-ticket")}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold text-base px-5 py-2 rounded-full w-full"
            >
              Proceed to Service Request Form
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

        <Card className="w-full shadow-lg border border-gray-200 flex flex-col gap-1.5 p-6">
          <CardHeader className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Ticket className="text-green-800 w-7 h-7" />
              </div>
              <p className="text-2xl font-semibold">Active Ticket</p>
            </div>
          </CardHeader>

          <CardContent className="py-3 flex flex-col items-center w-full max-w-xl mx-auto space-y-4.5">
            {/* Header Text */}
            <div className="w-full">
              <div className="flex justify-between w-full">
                <h3 className="text-lg font-bold text-gray-800">ICT-1001</h3>
                <Badge
                  className={`px-2 py-1 rounded-full text-md font-medium truncate ${
                    statusColors["Ongoing"] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  Ongoing
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Technical Support</p>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed">
              Unable to access dashboard analytics. Getting "403 Forbidden"
              error when trying to view reports section.
            </p>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-6 w-full text-sm">
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-medium">Nov 15, 2023</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium">2 hours ago</p>
              </div>
            </div>

            {/* <div className="flex justify-between items-center w-full border-t pt-4">
              <span className="text-sm text-gray-600">Priority</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="font-medium text-amber-700">Medium</span>
              </div>
            </div> */}

            {/* Buttons */}
            <div className="flex gap-4 w-full pt-2">
              <Button
                variant="outline"
                className="flex-1 hover:bg-gray-50 border-gray-300"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ClientDashboardPage;
