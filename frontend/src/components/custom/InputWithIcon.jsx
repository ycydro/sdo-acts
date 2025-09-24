import React, { Children } from "react";
import { Input } from "@/components/ui/input";

const InputWithIcon = ({ icon: Icon, children }) => {
  return (
    <div className="relative w-full">
      <Icon
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      {children}
    </div>
  );
};

export default InputWithIcon;
