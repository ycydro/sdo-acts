// src/pages/Login.jsx
import React from "react";
import { Link, Navigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";

import LoginForm from "../../components/custom/forms/LoginForm";
import SDO from "../../assets/imgs/SDO.webp";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { user } = useAuth();

  if (user?.role) {
    const redirectPath = user.role === "client" ? "/" : "/main";
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f4f4]">
      <Card
        className="
          grid
          w-full h-screen 
          rounded-none shadow-none
          overflow-hidden
          lg:grid-cols-[1.75fr_1fr] 
          lg:w-[65rem] lg:h-[40rem]
          lg:rounded-[2.25rem] lg:shadow-[0px_9px_13px_rgba(0,0,0,0.25)]
        "
      >
        {/* LEFT */}
        <div className="relative hidden lg:flex text-white min-h-full">
          <div className="absolute inset-0 bg-green-600/50 z-10 rounded-l-[2.25rem]" />
          <img
            src={SDO}
            alt="company"
            className="w-full h-full object-cover rounded-l-[2.25rem] object-left"
          />
          <div className="absolute bottom-6 left-6 z-20">
            <h1 className="font-bold text-7xl leading-none">SDO-ACTS</h1>
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
          <LoginForm />
          <p className="mb-2 text-base text-center">
            New here?
            <Link to="/register" className="text-primary ml-1 hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
