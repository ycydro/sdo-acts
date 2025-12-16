import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ value, large }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${large ? "h-6 w-6" : "h-4 w-4"} ${
            i < value ? "fill-yellow-400 text-yellow-400" : "text-muted"
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
