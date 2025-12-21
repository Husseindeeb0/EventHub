"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Ticket, Clock, X } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookingCard, { Booking } from "../../../components/booking/BookingCard";

import {
  AnimatedCard,
  AnimatedPageHeader,
} from "@/components/animations/PageAnimations";

// Main Booking Page Component
const BookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/bookings");
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Failed to fetch bookings");
        if (data.success) setBookings(data.bookings);
        else throw new Error(data.message || "Failed to fetch bookings");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, router, user?.bookedEvents?.length]);

  const upcomingBookings = bookings;

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-56px)] bg-linear-to-br from-indigo-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-indigo-900 font-bold uppercase tracking-widest text-xs">
            Loading your tickets...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-linear-to-br from-indigo-50/50 via-purple-50/50 to-blue-50/50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedPageHeader>
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight sm:text-5xl">
              My{" "}
              <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Bookings
              </span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Manage your upcoming reservations and tickets.
            </p>
          </div>
        </AnimatedPageHeader>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">
              Active Tickets
            </h2>
            <div className="h-[2px] flex-1 bg-linear-to-r from-indigo-100 to-transparent"></div>
            <span className="px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-[10px] font-black">
              {upcomingBookings.length}
            </span>
          </div>

          {upcomingBookings.length > 0 ? (
            <div className="flex flex-col gap-8">
              {upcomingBookings.map((booking, index) => (
                <AnimatedCard key={booking._id} delay={index * 0.1}>
                  <BookingCard booking={booking} />
                </AnimatedCard>
              ))}
            </div>
          ) : (
            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-12 text-center border-2 border-dashed border-indigo-100">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6 text-indigo-400">
                <Ticket className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                No Active Reservations
              </h3>
              <p className="text-slate-500 font-medium mb-8">
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
      </div>
    </main>
  );
};

export default BookingPage;
