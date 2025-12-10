"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import EventImage from "@/components/events/EventImage";

type EventVM = {
  id: string;
  title: string;
  location: string;
  startsAt: string; // ISO
  coverImageUrl?: string;
  capacity?: number;
  bookedCount: number;
};

function EventCard({ e }: { e: EventVM }) {
  const isFull = e.capacity != null && e.bookedCount >= e.capacity;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
      <Link href={`/home/${e.id}`} className="flex-1">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100">
          {e.coverImageUrl ? (
            <EventImage src={e.coverImageUrl} alt={e.title} />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center p-6">
                <svg
                  className="h-12 w-12 mx-auto text-purple-400 mb-2"
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
                <p className="text-sm font-medium text-purple-600">No Image</p>
              </div>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${
                isFull
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                  : "bg-white/90 text-purple-700 backdrop-blur-sm"
              }`}
            >
              {isFull ? "Sold Out" : "Available"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1.5 text-purple-700">
              <svg
                className="h-3.5 w-3.5 mr-1.5"
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
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
              }).format(new Date(e.startsAt))}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">
              {new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
              }).format(new Date(e.startsAt))}
            </span>
          </div>

          <h3 className="line-clamp-2 text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all">
            {e.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg
              className="h-4 w-4 shrink-0 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1 font-medium">{e.location}</span>
          </div>
        </div>
      </Link>

      <div className="border-t border-purple-100 bg-gradient-to-r from-purple-50/50 to-blue-50/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <span>
              {e.capacity != null
                ? `${e.bookedCount} / ${e.capacity} bookings`
                : `${e.bookedCount} bookings`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if booking was successful
    if (searchParams.get("booked") === "true") {
      setShowSuccess(true);
      // Remove the query parameter from URL without reloading
      window.history.replaceState({}, "", "/home");
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
    
    // Check if booking was cancelled
    if (searchParams.get("cancelled") === "true") {
      setShowCancelled(true);
      // Remove the query parameter from URL without reloading
      window.history.replaceState({}, "", "/home");
      // Hide cancellation message after 5 seconds
      setTimeout(() => setShowCancelled(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch events");
        }

        if (data.success) {
          setEvents(data.events || []);
        } else {
          throw new Error(data.message || "Failed to fetch events");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-100 via-indigo-100/60 via-purple-100/70 to-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.2),transparent_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.2),transparent_60%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-100 via-indigo-100/60 via-purple-100/70 to-blue-100/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.2),transparent_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.2),transparent_60%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-100 via-indigo-100/60 via-purple-100/70 to-blue-100/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.2),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.2),transparent_60%)] pointer-events-none"></div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white shadow-lg animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Booking Confirmed!</h3>
                <p className="text-sm text-white/90">
                  You've successfully reserved your spot. Check out more events below!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Message */}
        {showCancelled && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white shadow-lg animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Booking Cancelled</h3>
                <p className="text-sm text-white/90">
                  Your booking has been cancelled successfully. Explore more events below!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Explore Events
            </h1>
            <p className="mt-2 text-base text-zinc-600">
              Discover and book events happening around you.
            </p>
          </div>
        </div>

        <div className="mt-10">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 py-24 text-center">
              <div className="rounded-full bg-zinc-100 p-4">
                <svg
                  className="h-8 w-8 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-zinc-900">
                No events found
              </h2>
              <p className="mt-2 text-sm text-zinc-500 max-w-sm">
                Check back later for new events.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {events.map((e) => (
                <EventCard key={e.id} e={e} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
