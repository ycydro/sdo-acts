import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BackgroundWrapper = ({ children }) => {
  return (
    <Card className="p-7 overflow-auto w-full h-full bg-[#fcfcfc]">
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
};

export default BackgroundWrapper;
