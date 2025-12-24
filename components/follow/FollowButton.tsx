"use client";

import { useState } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useFollowUserMutation } from "@/redux/features/user/userApi";

interface FollowButtonProps {
  organizerId: string;
  initialIsFollowing: boolean;
  initialFollowerCount: number;
  className?: string; // Allow custom styling
}

export default function FollowButton({
  organizerId,
  initialIsFollowing,
  initialFollowerCount,
  className = "",
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);

  const [followUser, { isLoading: loading }] = useFollowUserMutation();

  const toggleFollow = async () => {
    try {
      const data = await followUser({ targetUserId: organizerId }).unwrap();

      // Ensure state matches server response exactly
      setIsFollowing(data.isFollowing);
      setFollowerCount(data.followerCount);
    } catch (error: any) {
      console.error("Follow error:", error);
      alert(
        error.data?.message ||
          "Failed to update follow status. Please try again."
      );
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={toggleFollow}
        disabled={loading}
        className={`flex items-center justify-center cursor-pointer gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-sm w-full ${
          isFollowing
            ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20"
        } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFollowing ? (
          <UserCheck className="w-4 h-4" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        <span>{isFollowing ? "Following" : "Follow"}</span>
      </button>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {followerCount} {followerCount === 1 ? "Follower" : "Followers"}
      </span>
    </div>
  );
}
