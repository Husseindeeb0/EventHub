"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      <div
        className="relative h-full w-full group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsFullScreen(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${className}`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] transition-all"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: isHovered ? 1 : 0.8 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white border border-white/30 hover:bg-white/30 transition-colors shadow-lg">
              <Maximize2 className="w-8 h-8" />
            </div>
            <span className="text-white font-medium text-sm tracking-wide bg-black/50 px-3 py-1 rounded-full">
              View Full Size
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Full Screen Lightbox */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={() => setIsFullScreen(false)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={() => setIsFullScreen(false)}
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
