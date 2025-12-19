"use client";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/features/auth/authSlice";

export default function ProfileHeader() {
  const user = useAppSelector(selectUser);

  if (!user) return null;

  return (
    <div className="relative mb-8">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200">
        <Image
          src="/event-cover.png"
          alt="Event Cover"
          fill
          className="object-cover opacity-90"
          priority
        />
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-4">
        <div className="relative flex items-end -mt-16 mb-4">
          {/* Avatar */}
          <div className="relative h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Actions */}
          <div className="ml-auto mb-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
              Edit Image
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
