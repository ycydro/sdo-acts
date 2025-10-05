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
    <Card className="p-4 overflow-auto w-fit">
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
};

export default BackgroundWrapper;
