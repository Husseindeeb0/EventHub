"use client";

import { useState } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [followUser, { isLoading: loading }] = useFollowUserMutation();

  const toggleFollow = async () => {
    try {
      const data = await followUser({ targetUserId: organizerId }).unwrap();

      // Ensure state matches server response exactly
      setIsFollowing(data.isFollowing);
      setFollowerCount(data.followerCount);
      router.refresh(); // Refresh to update server components if needed
    } catch (error: any) {
      console.error("Follow error:", error);
      alert(
        error.data?.message ||
          "Failed to update follow status. Please try again."
      );
    }
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <button
        onClick={toggleFollow}
        disabled={loading}
        className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-sm ${
          isFollowing
            ? "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
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
      <span className="text-sm font-medium text-gray-500">
        {followerCount} {followerCount === 1 ? "Follower" : "Followers"}
      </span>
    </div>
  );
}
