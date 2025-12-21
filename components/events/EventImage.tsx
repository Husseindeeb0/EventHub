"use client";

import { useState } from "react";

interface EventImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function EventImage({
  src,
  alt,
  className = "",
}: EventImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center p-6">
          <svg
            className="h-12 w-12 mx-auto text-purple-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-medium text-purple-600">No Image</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </>
  );
}
