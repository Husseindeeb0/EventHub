"use client";
import { useState } from "react";
import { Calendar, Mail, Edit2 } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/features/auth/authSlice";

interface ProfileInfoProps {
  onEditClick: () => void;
}

export default function ProfileInfo({ onEditClick }: ProfileInfoProps) {
  const user = useAppSelector(selectUser);

  if (!user) return null;

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          About
        </h2>
        <button
          onClick={onEditClick}
          className="p-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
          title="Edit Profile"
        >
          <Edit2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {user.description ? (
          <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
            {user.description}
          </p>
        ) : (
          <p className="text-gray-400 dark:text-slate-500 italic">
            No description provided...
          </p>
        )}

        <div className="flex flex-col space-y-3 text-sm text-gray-500 dark:text-slate-400 pt-2 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400 dark:text-slate-500" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500" />
            <span>Joined {joinedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
