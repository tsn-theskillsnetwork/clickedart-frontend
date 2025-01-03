import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function NumberCard({
  title,
  number,
  color,
  btnText,
  variant,
  url,
}) {
  return (
    <div className="rounded-xl bg-muted/50 shadow-md px-2 flex flex-col items-center gap-4 py-4">
      {title && (
        <h4 className="text-heading-06 sm:text-heading-05 md:text-heading-04">
          {title}
        </h4>
      )}
      {number && (
        <h2
          className={`text-heading-04 sm:text-heading-03 md:text-heading-02 font-semibold ${
            color ? `text-${color}-600` : "text-secondary-200"
          }`}
        >
          {number}
        </h2>
      )}
      {btnText && url && (
        <Link href={url}>
          <Button variant={variant} className="text-white">
            {btnText}
          </Button>
        </Link>
      )}
    </div>
  );
}
