"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showCount?: boolean;
  count?: number;
}

const sizes = { sm: "w-3 h-3", md: "w-5 h-5", lg: "w-7 h-7" };

export const StarRating = ({
  rating,
  onChange,
  size = "md",
  readonly = false,
  showCount = false,
  count = 0,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={cn(
            "transition-all duration-200",
            !readonly && "cursor-pointer hover:scale-125",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizes[size],
              star <= displayRating
                ? "fill-brand-gold text-brand-gold"
                : "text-gray-700"
            )}
          />
        </button>
      ))}
      {showCount && (
        <span className="text-[10px] text-gray-500 ml-2 font-indian tracking-widest">
          ({count} {count === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
};
