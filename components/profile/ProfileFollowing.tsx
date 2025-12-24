"use client";

import { useGetFollowingQuery } from "@/redux/features/auth/authApi";
import { Loader2, Building2, UserX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "@/components/follow/FollowButton";
import { AnimatedCard } from "@/components/animations/PageAnimations";

export default function ProfileFollowing() {
  const { data, isLoading, error } = useGetFollowingQuery();
  const following = data?.following || [];

  return (
    <div className="bg-white rounded-3xl border border-indigo-50 p-8 shadow-xl shadow-indigo-500/5">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
          Following Organizations
        </h2>
        <span className="ml-auto px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200">
          {following.length}
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <span className="text-sm font-medium">Loading organizations...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium text-center">
          Failed to load following list.
        </div>
      ) : following.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {following.map((org: any, index: number) => (
            <AnimatedCard key={org._id} delay={index * 0.1}>
              <div className="group relative flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
                <Link
                  href={`/organizers/${org._id}`}
                  className="shrink-0 relative"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                    {org.imageUrl ? (
                      <Image
                        src={org.imageUrl}
                        alt={org.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-lg">
                        {org.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/organizers/${org._id}`} className="block">
                    <h3 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {org.name}
                    </h3>
                  </Link>
                  <p className="text-xs font-medium text-slate-500 truncate">
                    {org.followersCount} Followers
                  </p>
                </div>

                <div className="shrink-0 flex items-center">
                  <FollowButton
                    organizerId={org._id}
                    initialIsFollowing={true}
                    initialFollowerCount={org.followersCount}
                    className="scale-75 origin-right translate-x-3"
                  />
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
            <UserX className="w-8 h-8" />
          </div>
          <p className="text-slate-900 font-bold mb-1">Not following anyone</p>
          <p className="text-sm text-slate-500 max-w-[200px]">
            Follow organizations to see them listed here.
          </p>
        </div>
      )}
    </div>
  );
}
