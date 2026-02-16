import React from "react";
import { Link, Navigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";

import LoginForm from "../../components/custom/forms/LoginForm";
import SDO from "../../assets/imgs/SDO.webp";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f4f4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user?.role) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f4f4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div
        className="
          grid
          w-full h-screen 
          rounded-none shadow-none
          overflow-hidden
          lg:grid-cols-[2fr_1fr] 
        "
      >
        {/* LEFT */}
        <div className="relative hidden lg:flex text-white min-h-full">
          <div className="absolute inset-0 bg-green-600/50 z-10" />
          <img
            src={SDO}
            alt="company"
            className="w-full h-full object-cover object-left"
          />
          <div className="absolute bottom-6 left-6 z-20">
            <h1 className="font-bold text-9xl leading-none">SDO-ACTS</h1>
            <p className="text-base lg:text-4xl">
              A Centralized Ticketing System for SDO Meycauayan
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <CardContent
          className="
            flex flex-col justify-center items-center gap-4 bg-[whitesmoke]
            rounded-none
            p-6 sm:p-10
          "
        >
          <LoginForm />
          {/* <p className="mb-2 text-base text-center">
            New here?
            <Link to="/register" className="text-primary ml-1 hover:underline">
              Create an account
            </Link>
          </p> */}
        </CardContent>
      </div>
    </main>
  );
};

export default LoginPage;
