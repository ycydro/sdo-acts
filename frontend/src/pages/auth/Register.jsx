// src/pages/Login.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "lucide-react";

import InputWithIcon from "../../components/custom/InputWithIcon";

import Logo from "../../assets/imgs/SDO-LOGO.webp";
import SDO from "../../assets/imgs/SDO.webp";
import SearchGroup from "../../components/custom/SearchGroup";

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f4f4]">
      <Card
        className="
          grid
          lg:grid-cols-[1fr_1.75fr] 
          w-full h-screen 
          lg:w-[65rem] lg:h-[40rem]
          rounded-none shadow-none
          lg:rounded-[2.25rem] lg:shadow-[0px_9px_13px_rgba(0,0,0,0.25)]
          overflow-hidden
        "
      >
        {/* LEFT (hidden on small, visible on lg+) */}
        <div className="relative hidden lg:flex text-white min-h-full">
          <div className="absolute inset-0 bg-green-600/50 z-10 rounded-l-[2.25rem]" />
          <img
            src={SDO}
            alt="company"
            className="w-full h-full object-cover rounded-l-[2.25rem] object-left"
          />
          <div className="absolute bottom-6 left-6 z-20">
            <h1 className="font-bold text-5xl lg:text-[3.75rem] leading-none">
              SDO-ACTS
            </h1>
          </div>
        </div>

        {/* RIGHT */}
        <CardContent
          className="
            flex flex-col justify-center items-center gap-4 bg-[whitesmoke]
            rounded-none lg:rounded-r-[2.25rem]
            p-6 sm:p-10
          "
        >
          <form className="w-full max-w-sm flex flex-col items-center gap-4">
            <div className="flex justify-center w-full">
              <img
                src={Logo}
                alt="logo"
                className="w-20 h-20 sm:w-24 sm:h-24"
              />
            </div>

            <h2 className="text-center text-xl sm:text-2xl font-semibold">
              SDO-ACTS Registration
            </h2>

            <Label htmlFor="fname">
              <User size={20} /> First Name
            </Label>
            <Input
              id="fname"
              name="fname"
              placeholder="Enter Email Address"
              className="rounded-[1rem] py-4 pl-12"
            />
            <Input
              id="email"
              name="email"
              placeholder="Enter Email Address"
              className="rounded-[1rem] py-4 pl-12"
            />
            <Input
              id="email"
              name="email"
              placeholder="Enter Email Address"
              className="rounded-[1rem] py-4 pl-12"
            />

            <Input
              id="email"
              name="email"
              placeholder="Enter Email Address"
              className="rounded-[1rem] py-4 pl-12"
            />

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Password"
              className="rounded-[1rem] py-4 pl-12"
            />
          </form>

          <div className="w-full max-w-sm flex items-center gap-4">
            <Button variant="outline" className="p-4 w-50 rounded-full">
              Cancel
            </Button>
            <Button className="p-4 w-50 rounded-full">Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
