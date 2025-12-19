"use client";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/features/auth/authSlice";

interface ProfileHeaderProps {
  onEditClick: () => void;
}

import { useState } from "react";
import { Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileHeaderProps {
  onEditClick: () => void;
}

export default function ProfileHeader({ onEditClick }: ProfileHeaderProps) {
  const user = useAppSelector(selectUser);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  if (!user) return null;

  return (
    <>
      <div className="relative mb-8">
        {/* Cover Image */}
        <div
          className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200 group cursor-pointer"
          onClick={() => user.coverImageUrl && setViewingImage(user.coverImageUrl)}
        >
          <Image
            src={user.coverImageUrl || "/event-cover.png"}
            alt="User Cover"
            fill
            className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
            priority
          />
          {/* Gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Hover Overlay with Eye Icon */}
          {user.coverImageUrl && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Eye className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-4">
          <div className="relative flex items-end -mt-16 mb-4">
            {/* Avatar */}
            <div
              className="relative h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg group cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                user.imageUrl && setViewingImage(user.imageUrl);
              }}
            >
              {user.imageUrl ? (
                <>
                  <Image
                    src={user.imageUrl}
                    alt={user.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                </>
              ) : (
                <span className="text-4xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="ml-auto mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering cover click
                  onEditClick();
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer shadow-sm relative z-10"
              >
                Edit Cover Photo
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Full Screen Image Viewer Modal */}
      <AnimatePresence>
        {viewingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setViewingImage(null)}
          >
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image wrapper
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={viewingImage}
                alt="Full View"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
