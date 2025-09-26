import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/imgs/SDO-LOGO.webp";
import { User, Users, Clipboard, Mail, Phone, ShieldCheck } from "lucide-react";

const RegistrationForm = () => {
  const navigate = useNavigate();
  return (
    <form className="w-full flex flex-col items-center gap-4 px-5">
      <div className="flex justify-center w-full">
        <img src={Logo} alt="logo" className="w-23 h-23 sm:w-25 sm:h-25" />
      </div>

      <h2 className="text-center text-2xl sm:text-3xl font-semibold">
        SDO-ACTS Registration Form
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="space-y-1 w-full sm:w-1/2">
          <Label htmlFor="first_name" className="flex items-center gap-2">
            <User size={20} /> First Name
          </Label>
          <Input
            id="first_name"
            name="first_name"
            placeholder="Enter Email Address"
            className="rounded-[1rem] pl-5"
          />
        </div>

        <div className="space-y-1 w-full sm:w-1/2">
          <Label htmlFor="last_name" className="flex items-center gap-2">
            <User size={20} /> Last Name
          </Label>
          <Input
            id="last_name"
            name="last_name"
            placeholder="Enter Email Address"
            className="rounded-[1rem] pl-5"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="space-y-1 w-full sm:w-1/2">
          <Label htmlFor="gender" className="flex items-center gap-2">
            <Users size={20} /> Gender
          </Label>
          <Select>
            <SelectTrigger className="rounded-[1rem] min-w-full pl-5">
              <SelectValue placeholder="Select your Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 w-full sm:w-1/2">
          <Label htmlFor="client_type" className="flex items-center gap-2">
            <Clipboard size={20} /> Client Type
          </Label>
          <Select>
            <SelectTrigger className="rounded-[1rem] min-w-full pl-5">
              <SelectValue placeholder="Select your Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="guest">Guest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Single fields stacked full width */}
      <div className="space-y-1 w-full">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail size={20} /> Email
        </Label>
        <Input
          id="email"
          name="email"
          placeholder="Enter Email Address"
          className="rounded-[1rem] pl-5"
        />
      </div>
      <div className="space-y-1 w-full">
        <Label htmlFor="phone_no" className="flex items-center gap-2">
          <Phone size={20} /> Phone Number
        </Label>
        <Input
          id="phone_no"
          name="phone_no"
          placeholder="Enter Email Address"
          className="rounded-[1rem] pl-5"
        />
      </div>
      <div className="space-y-1 w-full">
        <Label htmlFor="password" className="flex items-center gap-2">
          <ShieldCheck size={20} /> Password
        </Label>
        <Input
          id="password"
          name="password"
          placeholder="Enter Email Address"
          className="rounded-[1rem] pl-5"
        />
      </div>

      <Button type="button" className="p-4 w-full rounded-full">
        Register
      </Button>
    </form>
  );
};

export default RegistrationForm;
