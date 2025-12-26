"use client";

import { useState } from "react";
import { Ticket } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AnimatedCard,
  AnimatedPageHeader,
} from "@/components/animations/PageAnimations";
import Loading from "@/components/ui/Loading";
import RatingModal from "@/components/ui/RatingModal";
import BookingCard from "@/components/booking/BookingCard";
import {
  useGetBookingsQuery,
  Booking,
} from "@/redux/features/bookings/bookingsApi";

// Main Booking Page Component
const BookingPage = () => {
  const [selectedBookingForRating, setSelectedBookingForRating] =
    useState<Booking | null>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useGetBookingsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const bookings = data?.bookings || [];

  const now = new Date();

  const activeBookings = bookings.filter((b) => {
    const endDate = b.endsAt ? new Date(b.endsAt) : new Date(b.startsAt);
    return endDate >= now;
  });

  const attendedBookings = bookings.filter((b) => {
    const endDate = b.endsAt ? new Date(b.endsAt) : new Date(b.startsAt);
    return endDate < now;
  });

  if (loading) {
    return <Loading fullScreen message="Loading your tickets..." />;
  }

  return (
    <main className="min-h-[calc(100vh-56px)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.1),transparent_50%)] dark:hidden pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.1),transparent_50%)] dark:hidden pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedPageHeader>
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight sm:text-5xl">
              My{" "}
              <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Bookings
              </span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
              Manage your upcoming reservations and tickets.
            </p>
          </div>
        </AnimatedPageHeader>

        {/* Active Bookings Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-widest">
              Active Tickets
            </h2>
            <div className="h-[2px] flex-1 bg-linear-to-r from-indigo-100 to-transparent dark:from-indigo-900/30"></div>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black">
              {activeBookings.length}
            </span>
          </div>

          {activeBookings.length > 0 ? (
            <div className="flex flex-col gap-8">
              {activeBookings.map((booking, index) => (
                <AnimatedCard key={booking._id} delay={index * 0.1}>
                  <BookingCard
                    booking={booking}
                    onRate={(b) => setSelectedBookingForRating(b)}
                  />
                </AnimatedCard>
              ))}
            </div>
          ) : (
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-12 text-center border-2 border-dashed border-indigo-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto mb-6 text-indigo-400">
                <Ticket className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                No Active Reservations
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                Time to find your next favorite experience!
              </p>
              <Link
                href="/home"
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all"
              >
                Browse Events
              </Link>
            </div>
          )}
        </section>

        {/* Attended Events Section */}
        {attendedBookings.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-widest">
                Past Events
              </h2>
              <div className="h-[2px] flex-1 bg-linear-to-r from-slate-200 to-transparent dark:from-slate-800"></div>
              <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-black">
                {attendedBookings.length}
              </span>
            </div>

            <div className="flex flex-col gap-8">
              {attendedBookings.map((booking, index) => (
                <AnimatedCard key={booking._id} delay={0.2 + index * 0.1}>
                  <BookingCard
                    booking={booking}
                    onRate={(b) => setSelectedBookingForRating(b)}
                  />
                </AnimatedCard>
              ))}
            </div>
          </section>
        )}

        <RatingModal
          isOpen={!!selectedBookingForRating}
          onClose={() => {
            setSelectedBookingForRating(null);
            // Refresh logic: fetchBookings() or just reload if simpler
            window.location.reload();
          }}
          eventId={selectedBookingForRating?.eventId || ""}
          eventTitle={selectedBookingForRating?.title || ""}
        />
      </div>
    </main>
  );
};

export default BookingPage;
