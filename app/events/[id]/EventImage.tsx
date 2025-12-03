"use client";

import React from "react";

interface EventImageProps {
  src: string;
  alt: string;
}

export default function EventImage({ src, alt }: EventImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={(e) => {
        // Hide image on error to show clean gradient background
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
