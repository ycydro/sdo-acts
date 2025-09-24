// src/pages/Login.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock } from "lucide-react";

import InputWithIcon from "../components/custom/InputWithIcon";

import Logo from "../assets/imgs/SDO-LOGO.webp";
import SDO from "../assets/imgs/SDO.webp";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f4f4]">
      <Card
        className="
          grid
          lg:grid-cols-[1.75fr_1fr] 
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
            <h1 className="font-bold text-5xl lg:text-[4.75rem] leading-none">
              SDO-ACTS
            </h1>
            <p className="text-base lg:text-[1.2rem]">
              A Centralized Ticketing System for SDO Meycauayan
            </p>
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
              Welcome!
            </h2>

            <InputWithIcon icon={Mail}>
              <Input
                id="email"
                name="email"
                placeholder="Enter Email Address"
                className="rounded-[1rem] py-4 pl-12"
              />
            </InputWithIcon>

            <InputWithIcon icon={Lock}>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter Password"
                className="rounded-[1rem] py-4 pl-12"
              />
            </InputWithIcon>

            <div className="w-full flex items-center px-1">
              <Checkbox id="remember" className="border-1 border-primary" />
              <Label htmlFor="remember" className="ml-2 text-sm sm:text-base">
                Remember me
              </Label>
            </div>

            <Button
              onClick={(e) => e.preventDefault()}
              className="p-4 w-full rounded-full"
            >
              Login
            </Button>
          </form>

          <p className="mb-2 text-sm text-center">
            New here?
            <span
              id="register"
              className="text-primary cursor-pointer hover:underline"
            >
              Create an account
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
