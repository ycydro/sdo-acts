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
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          {/* Department */}
          <div className="col-span-1 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold mb-1">
              <Building2 className="w-4 h-4 text-gray-700" />
              Department
            </label>
            <select
              value={department}
              onChange={handleDepartmentChange}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Department</option>
              <option value="Information Communication Technology">
                Information Communication Technology
              </option>
            </select>
          </div>

          {/* Service Category */}
          <div className="col-span-1 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold mb-1">
              <ClipboardList className="w-4 h-4 text-gray-700" />
              Service Category
            </label>
            <select
              value={serviceCategory}
              onChange={handleServiceCategoryChange}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Service</option>
              <option value="Repair">Repair</option>
            </select>
          </div>

          {/* Subject */}
          <div className="col-span-1 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold mb-1">
              <BookText className="w-4 h-4 text-gray-700" />
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {/* Additional Info */}
          <div className="col-span-1">
            <label className="flex items-center gap-2 text-sm font-semibold mb-1">
              <FileText className="w-4 h-4 text-gray-700" />
              Additional Information
            </label>
            <input
              type="text"
              placeholder="Any additional information"
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Priority Level */}
          <div className="col-span-1">
            <label className="flex items-center gap-2 text-sm font-semibold mb-1">
              <AlertCircle className="w-4 h-4 text-gray-700" />
              Priority Level
            </label>
            <input
              type="text"
              value={priority}
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Button
              type="button"
              onClick={() => navigate("/create-ticket")}
              variant="outline"
              className="w-full sm:w-40 border-2 border-green-700 text-green-700 rounded-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <Button
              type="submit"
              className="w-full sm:w-40 bg-green-700 hover:bg-green-800 text-white rounded-full flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
