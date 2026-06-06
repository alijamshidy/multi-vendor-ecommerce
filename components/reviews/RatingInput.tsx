"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { Label } from "../ui/label";

export default function RatingInput({
  name,
  labelText,
}: {
  name: string;
  labelText: string;
}) {
  const [rating, setRating] = useState(0);
  const t = useTranslations("reviews");
  return (
    <div className="mb-2 max-w-md">
      {labelText ? (
        <Label
          htmlFor={name}
          className="mb-1 capitalize">
          {labelText}
        </Label>
      ) : null}
      <input
        type="hidden"
        name={name}
        value={rating}
      />
      <div
        className="flex items-center gap-x-1"
        role="radiogroup"
        aria-label={labelText || name}>
        {Array.from({ length: 5 }, (_, i) => i + 1).map(value => {
          const isFilled = value <= rating;
          const className = `h-6 w-6 cursor-pointer transition-colors ${
            isFilled ? "text-primary" : "text-gray-500 hover:text-primary/70"
          }`;

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={value === rating}
              aria-label={String(value)}
              className="inline-flex"
              onClick={() => setRating(value)}>
              {isFilled ? (
                <FaStar className={className} />
              ) : (
                <FaRegStar className={className} />
              )}
            </button>
          );
        })}
        {rating > 0 ? (
          <span className="w-full text-center text-xl text-accent-foreground">
            {t("ratingSelected", { rating })}
          </span>
        ) : null}
      </div>
    </div>
  );
}
