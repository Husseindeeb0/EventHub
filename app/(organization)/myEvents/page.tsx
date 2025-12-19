"use client";

import Link from "next/link";
import AnimatedPageHeader from "@/components/animations/AnimatedPageHeader";
import AnimatedGrid from "@/components/animations/AnimatedGrid";
import AnimatedMyEventCard from "@/components/events/AnimatedMyEventCard";
import { useGetEventsQuery } from "@/redux/features/events/eventsApi";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyEventsPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Redirect if not authenticated or not organizer
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Or AuthInitializer handles this
    } else if (user && user.role !== "organizer") {
      router.push("/home");
    }
  }, [isAuthenticated, user, router]);

  const { data, isLoading } = useGetEventsQuery(
    user?._id ? { organizerId: user._id } : { organizerId: "skip" },
    {
      skip: !user?._id || user.role !== "organizer",
      refetchOnMountOrArgChange: true
    }
  );

  const events = data?.events || [];

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-100 via-indigo-100/60 via-purple-100/70 to-pink-100/50 relative overflow-hidden flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-100 via-indigo-100/60 via-purple-100/70 to-pink-100/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.18),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.18),transparent_50%)] pointer-events-none"></div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <AnimatedPageHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl">
                My Events
              </h1>
              <p className="mt-3 text-lg text-slate-600">
                Manage your events and track attendee bookings.
              </p>
            </div>

            <Link
              href="/createEvent"
              className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span className="mr-2 text-lg leading-none">+</span> Create Event
            </Link>
          </div>
        </AnimatedPageHeader>

        <div className="mt-10">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 py-24 text-center">
              <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 p-6 shadow-lg">
                <svg
                  className="h-12 w-12 text-purple-600"
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
              </div>
              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                No events found
              </h2>
              <p className="mt-2 text-base text-slate-600 max-w-sm">
                Get started by creating your first event. It only takes a few
                minutes.
              </p>
              <Link
                href="/createEvent"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40"
              >
                Create your first event
              </Link>
            </div>
          ) : (
            <AnimatedGrid>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((e, index) => (
                  <AnimatedMyEventCard key={e.id} e={e} index={index} />
                ))}
              </div>
            </AnimatedGrid>
          )}
        </div>
      </div>
    </main>
  );
}
