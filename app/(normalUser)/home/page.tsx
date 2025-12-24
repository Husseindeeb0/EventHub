"use client";

import React, { useState } from "react";
import { useGetEventsQuery } from "@/redux/features/events/eventsApi";
import EventCard from "@/components/events/EventCard";
import EventSearchBar from "@/components/events/EventSearchBar";
import {
  AnimatedCard,
  AnimatedPageHeader,
} from "@/components/animations/PageAnimations";
import Loading from "@/components/ui/Loading";

export default function EventsPage() {
  const [filters, setFilters] = useState<{
    search: string;
    category: string;
    status: "active" | "finished" | "";
  }>({
    search: "",
    category: "All",
    status: "",
  });

  const {
    data,
    isLoading: loading,
    error,
  } = useGetEventsQuery({
    ...filters,
    status: filters.status || undefined,
  });
  const events = data?.events || [];

  const handleSearch = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <Loading fullScreen message="Loading your experiences..." />;
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-slate-50 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white border border-red-50 rounded-2xl p-10 text-center shadow-sm max-w-md mx-auto">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              We couldn't load the events. Please try again or check back later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 font-bold text-sm"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-slate-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-linear-to-b from-indigo-50/50 to-transparent -z-10" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 relative z-10">
        <AnimatedPageHeader>
          <header className="relative mb-8">
            <div className="flex flex-col gap-2 relative z-10 text-center sm:text-left">
              <span className="inline-flex w-fit mx-auto sm:mx-0 items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 border border-indigo-100">
                Curated Selection
              </span>
              <div className="relative group inline-block">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl relative z-10 leading-tight">
                  Popular Events
                </h1>
                {/* Subtle Feathered Glow Header */}
                <div className="absolute -left-10 -right-20 top-1/2 -translate-y-1/2 h-full w-[120%] bg-radial from-indigo-100/30 via-indigo-50/10 to-transparent blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
              <p className="text-sm text-slate-500 font-medium max-w-md">
                Join thousands of people at the best experiences happening right
                now.
              </p>
            </div>
          </header>
        </AnimatedPageHeader>

        <EventSearchBar onSearch={handleSearch} />

        <div className="mt-8">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white py-32 text-center shadow-xs">
              <div className="rounded-2xl bg-slate-50 p-5 mb-4">
                <svg
                  className="h-10 w-10 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                No events found
              </h2>
              <p className="mt-3 text-sm text-slate-400 max-w-xs font-medium leading-relaxed">
                It seems there are no events matching your criteria right now.
                Check back soon for exciting updates!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
              {events.map((e, index) => (
                <AnimatedCard key={e.id} delay={index * 0.1}>
                  <EventCard e={e} />
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
