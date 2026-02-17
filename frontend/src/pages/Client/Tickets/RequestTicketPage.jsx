import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Building2,
  ClipboardList,
  BookText,
  FileText,
  AlertCircle,
  Send,
  ArrowLeft,
} from "lucide-react";
import RequestTicketForm from "../../../components/custom/forms/RequestTicketForm";

export default function RequestTicketPage() {
  return (
    <Card className="w-full sm:w-[90%] lg:w-[70%] max-w-4xl p-4 sm:p-6 shadow-lg border border-gray-200 self-center">
      <CardHeader className="text-center">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Ticket Form
        </CardTitle>
      </CardHeader>

      <CardContent>
        <RequestTicketForm />
      </CardContent>
    </Card>
  );
}
