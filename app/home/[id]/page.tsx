"use client";

import { useGetEventByIdQuery } from "@/redux/features/events/eventsApi";
import { notFound, useParams, useSearchParams } from "next/navigation";
import BookingForm from "./BookingForm";
import {
  AnimatedHero,
  AnimatedContent,
  AnimatedCard,
  AnimatedSuccessMessage,
} from "./AnimatedEventContent";
import EventImage from "./EventImage";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import { useEffect, useState } from "react";

// Local helper for date formatting if not already in utils
function formatEventDate(date: any): string {
  if (!date) return "Date TBA";

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Date TBA";
    }
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(dateObj);
  } catch (error) {
    return "Date TBA";
  }
}

export default function EventDetailsPage() {
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const bookedParam = searchParams.get("booked");
  const cancelledParam = searchParams.get("cancelled");

  const { data, isLoading, error } = useGetEventByIdQuery(id);
  const event = data?.event;

  const { user } = useAppSelector((state) => state.auth);
  // We need to know if the user acts has a booking.

  const hasUserBooked = user?.bookedEvents?.includes(id);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-100/70 via-purple-100/80 via-blue-100/90 to-cyan-100/60 relative overflow-hidden flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </main>
    );
  }

  if (!event || error) {
    if (error && "status" in error && error.status === 404) notFound();
    return (
      <div className="p-8 text-center text-red-500">
        Error loading event.{" "}
        <button onClick={() => window.location.reload()} className="underline">
          Retry
        </button>
      </div>
    );
  }

  const bookedCount = (event as any).bookedCount || 0; // Fallback until I fix the route
  const remainingSeats = event.capacity ? event.capacity - bookedCount : null;
  const isFull = event.capacity ? bookedCount >= event.capacity : false;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100/70 via-purple-100/80 via-blue-100/90 to-cyan-100/60 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none"></div>
      {/* Hero Section */}
      <AnimatedHero>
        <div className="relative h-[500px] w-full overflow-hidden bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200">
          {event.coverImageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <EventImage src={event.coverImageUrl} alt={event.title} />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="h-20 w-20 mx-auto text-purple-400 mb-4"
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
                <p className="text-lg font-semibold text-purple-700">
                  No Cover Image
                </p>
              </div>
            </div>
          )}
          {event.coverImageUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-800/70 to-transparent"></div>
          )}
          <div className="absolute inset-0 flex items-end p-8 sm:p-12">
            <div className="mx-auto w-full max-w-5xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                {event.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg
                    className="h-5 w-5"
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
                  <span className="font-medium">
                    {formatEventDate(event.startsAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg
                    className="h-5 w-5"
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
                  <span className="font-medium">{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedHero>

      <AnimatedContent>
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
          {bookedParam === "true" && (
            <AnimatedSuccessMessage>
              <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white shadow-lg">
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
                      You've successfully booked a spot for this event.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSuccessMessage>
          )}

          {cancelledParam === "true" && (
            <AnimatedSuccessMessage>
              <div className="mb-8 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white shadow-lg">
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
                      Your booking has been successfully cancelled.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSuccessMessage>
          )}

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <AnimatedCard delay={0.4}>
                <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-lg">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                    About this event
                  </h2>
                  {event.description ? (
                    <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line">
                      {event.description}
                    </p>
                  ) : (
                    <p className="text-lg leading-relaxed text-slate-500 italic">
                      No description provided for this event.
                    </p>
                  )}
                </div>
              </AnimatedCard>
            </div>

            <div className="lg:col-span-1">
              <AnimatedCard delay={0.6}>
                <div className="sticky top-24 rounded-3xl border border-purple-100 bg-white p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    {hasUserBooked ? "Your Booking" : "Book Your Spot"}
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-3 border-b border-purple-100">
                      <span className="text-sm font-medium text-slate-600">
                        Price
                      </span>
                      <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Free
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">
                        Bookings
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          isFull ? "text-red-600" : "text-slate-900"
                        }`}
                      >
                        {event.capacity != null
                          ? `${bookedCount} / ${event.capacity}`
                          : `${bookedCount}`}
                      </span>
                    </div>
                  </div>

                  {isFull && !hasUserBooked ? (
                    <div className="rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-red-700 font-semibold">
                        <svg
                          className="h-5 w-5"
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
                        <span>Event is Full</span>
                      </div>
                    </div>
                  ) : (
                    <BookingForm
                      // @ts-ignore
                      eventId={id}
                      initialBooking={
                        hasUserBooked
                          ? { status: "confirmed", user: user?._id }
                          : null
                      }
                    />
                  )}
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </AnimatedContent>
    </main>
  );
}
