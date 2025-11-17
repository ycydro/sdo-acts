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
  const navigate = useNavigate();

  const [department, setDepartment] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [priority, setPriority] = useState("-");
  const [subject, setSubject] = useState("");

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setServiceCategory("");
    setPriority("-");
  };

  const handleServiceCategoryChange = (e) => {
    const selected = e.target.value;
    setServiceCategory(selected);
    setPriority(
      selected === "Repair" ? "High Priority" : selected ? "Low" : "-"
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!department || !serviceCategory || !subject.trim()) return;
  };

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
