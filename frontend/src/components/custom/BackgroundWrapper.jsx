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

import clsx from "clsx";

const BackgroundWrapper = ({ children, className }) => {
  return (
    <Card
      className={clsx(
        "p-7 overflow-auto w-full h-full bg-[#fcfcfc]",
        className
      )}
    >
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
};

export default BackgroundWrapper;
