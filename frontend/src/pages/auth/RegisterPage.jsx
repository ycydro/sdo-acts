// src/pages/Login.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

import SDO from "../../assets/imgs/SDO.webp";
import RegistrationForm from "../../components/custom/forms/RegistrationForm";

const RegisterPage = () => {
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
          lg:overflow-hidden
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
            flex flex-col justify-center items-center gap- bg-[whitesmoke]
            rounded-none lg:rounded-r-[2.25rem]
            px-6 sm:px-10
          "
        >
          <RegistrationForm />
          <p className="my-3 text-sm text-center">
            Already have an account?
            <Link to="/login" className="text-primary ml-1 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
