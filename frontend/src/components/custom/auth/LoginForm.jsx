import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router";

import InputWithIcon from "../InputWithIcon";
import Logo from "../../../assets/imgs/SDO-LOGO.webp";

const LoginForm = () => {
  const navigate = useNavigate();
  return (
    <form className="w-full max-w-sm flex flex-col items-center gap-4">
      <div className="flex justify-center w-full">
        <img src={Logo} alt="logo" className="w-20 h-20 sm:w-24 sm:h-24" />
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

      <div className="w-full flex items-center px-1 ml-2.5 ">
        <Checkbox id="remember" className="border-1 border-primary" />
        <Label htmlFor="remember" className="ml-2 text-base">
          Remember me
        </Label>
      </div>

      <Button
        type="button"
        className="p-4 w-full rounded-full"
        onClick={() => navigate("/")}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
