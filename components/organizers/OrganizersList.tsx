"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Users,
  ArrowRight,
  Star,
  SlidersHorizontal,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import { AnimatedCard } from "@/components/animations/PageAnimations";
import FollowButton from "@/components/follow/FollowButton";
import { motion, AnimatePresence } from "framer-motion";

interface Organizer {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  description?: string;
  followers: string[];
  averageRating: number;
  eventCount: number;
}

interface OrganizersListProps {
  initialOrganizers: Organizer[];
  currentUser: any;
}

const sortOptions = [
  { value: "followers", label: "Most Followed", icon: Users },
  { value: "rating", label: "Top Rated", icon: Star },
  { value: "events", label: "Most Events", icon: ArrowRight },
];

const followerRanges = [
  { label: "Any", value: 0 },
  { label: "10+", value: 10 },
  { label: "50+", value: 50 },
  { label: "100+", value: 100 },
];

export default function OrganizersList({
  initialOrganizers,
  currentUser,
}: OrganizersListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"followers" | "rating" | "events">(
    "followers"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [minFollowers, setMinFollowers] = useState(0);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAndSortedOrganizers = useMemo(() => {
    return initialOrganizers
      .filter((org) => {
        const matchesSearch =
          org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          org.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRating = (org.averageRating || 0) >= minRating;
        const matchesFollowers = (org.followers?.length || 0) >= minFollowers;

        return matchesSearch && matchesRating && matchesFollowers;
      })
      .sort((a, b) => {
        if (sortBy === "followers")
          return (b.followers?.length || 0) - (a.followers?.length || 0);
        if (sortBy === "rating")
          return (b.averageRating || 0) - (a.averageRating || 0);
        if (sortBy === "events")
          return (b.eventCount || 0) - (a.eventCount || 0);
        return 0;
      });
  }, [initialOrganizers, searchQuery, sortBy, minRating, minFollowers]);

  const activeSort = sortOptions.find((opt) => opt.value === sortBy);

  const clearFilters = () => {
    setMinRating(0);
    setMinFollowers(0);
    setSearchQuery("");
  };

  const hasActiveFilters =
    minRating > 0 || minFollowers > 0 || searchQuery !== "";

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search organizers by name or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-hidden"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Custom Sort Dropdown */}
          <div className="relative flex-1 lg:w-56" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all group"
            >
              <div className="flex items-center gap-2">
                {activeSort && (
                  <activeSort.icon className="w-4 h-4 text-indigo-500" />
                )}
                <span>{activeSort?.label}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 overflow-hidden"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value as any);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        sortBy === option.value
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <option.icon
                          className={`w-4 h-4 ${
                            sortBy === option.value
                              ? "text-indigo-500"
                              : "text-slate-400"
                          }`}
                        />
                        {option.label}
                      </div>
                      {sortBy === option.value && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl border transition-all relative ${
              showFilters
                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {!showFilters && (minRating > 0 || minFollowers > 0) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Followers Filter */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Follower Count
                    </label>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {
                        followerRanges.find((r) => r.value === minFollowers)
                          ?.label
                      }
                    </span>
                  </div>
                  <div className="flex bg-slate-50 p-1 rounded-xl">
                    {followerRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setMinFollowers(range.value)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          minFollowers === range.value
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Minimum Rating
                    </label>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      {minRating > 0 ? `${minRating}+ Stars` : "Any Rating"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setMinRating(minRating === star ? 0 : star)
                        }
                        className={`flex-1 h-10 rounded-xl border transition-all flex items-center justify-center group ${
                          minRating >= star
                            ? "bg-amber-50 border-amber-200 text-amber-500 shadow-xs"
                            : "bg-white border-slate-100 text-slate-300 hover:border-amber-200 hover:bg-amber-50/50"
                        }`}
                      >
                        <Star
                          className={`w-5 h-5 transition-all duration-300 ${
                            minRating >= star
                              ? "fill-amber-500 scale-110"
                              : "group-hover:text-amber-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex items-end gap-3">
                  <button
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="flex-1 py-3 px-4 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 hover:text-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-2 py-3 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
          {filteredAndSortedOrganizers.length} Results Found
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {filteredAndSortedOrganizers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white py-32 text-center shadow-xs">
          <div className="rounded-2xl bg-slate-50 p-5 mb-4">
            <Users className="h-10 w-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            No organizers found
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-xs font-medium leading-relaxed">
            Try adjusting your search terms or filters to find what you're
            looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedOrganizers.map((organizer, index) => {
            const isFollowing = currentUser
              ? organizer.followers?.includes(currentUser.userId)
              : false;

            return (
              <AnimatedCard key={organizer._id} delay={index * 0.05}>
                <div className="group bg-white rounded-4xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-500 flex flex-col h-full">
                  {/* Header/Cover Placeholder */}
                  <div className="relative h-32 bg-linear-to-r from-indigo-600 to-purple-600">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 border border-white/30">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-white">
                        {organizer.averageRating > 0
                          ? organizer.averageRating.toFixed(1)
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-6 flex-1 flex flex-col items-center -mt-12">
                    {/* Avatar */}
                    <div className="relative mb-4 group/avatar">
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white ring-4 ring-slate-50 group-hover:ring-indigo-50 transition-all duration-500 relative">
                        {organizer.imageUrl ? (
                          <Image
                            src={organizer.imageUrl}
                            alt={organizer.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-3xl font-black text-indigo-400">
                            {organizer.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 text-center mb-1 group-hover:text-indigo-600 transition-colors">
                      {organizer.name}
                    </h3>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                        <Users className="w-3 h-3" />
                        <span>{organizer.followers?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                        <ArrowRight className="w-3 h-3 text-indigo-500" />
                        <span>{organizer.eventCount} Events</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 text-center line-clamp-2 mb-6 font-medium leading-relaxed px-2">
                      {organizer.description ||
                        "Bringing unique experiences and unforgettable moments to the EventHub community."}
                    </p>

                    <div className="mt-auto w-full space-y-4">
                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          {currentUser &&
                          currentUser.userId === organizer._id ? (
                            <div className="w-full py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Your Profile
                            </div>
                          ) : currentUser ? (
                            <FollowButton
                              organizerId={organizer._id}
                              initialIsFollowing={isFollowing}
                              initialFollowerCount={
                                organizer.followers?.length || 0
                              }
                              className="w-full! shadow-none!"
                            />
                          ) : (
                            <Link
                              href="/login"
                              className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
                            >
                              Login to Follow
                            </Link>
                          )}
                        </div>
                        <Link
                          href={`/organizers/${organizer._id}`}
                          className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 group/btn"
                          title="View Profile"
                        >
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-all duration-300 ease-in-out" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
