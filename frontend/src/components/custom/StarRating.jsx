import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ value }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= value ? `fill-current text-yellow-400` : "text-border"
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
