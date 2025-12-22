"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Ticket, Clock, X } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
<<<<<<< Updated upstream
import BookingCard, { Booking } from "../../../components/booking/BookingCard";
=======
import GiveFeedbackButton from "@/components/GiveFeedbackButton";
>>>>>>> Stashed changes

import {
  AnimatedCard,
  AnimatedPageHeader,
} from "@/components/animations/PageAnimations";

<<<<<<< Updated upstream
import Loading from "@/components/ui/Loading";
=======
// Helper function to check if an event is in the past
const isPastEvent = (dateString: string) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
};

// Component for a single booked event card
const BookingCard: React.FC<{ booking: Booking; showFeedbackButton: boolean }> = ({
  booking,
  showFeedbackButton,
}) => {
  const {
    title,
    location,
    startsAt,
    coverImageUrl,
    capacity,
    numberOfSeats,
    eventId,
  } = booking;
  const isPast = isPastEvent(startsAt);

  const formattedDate = new Date(startsAt).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(startsAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Link href={`/home/${eventId}`}>
      <div
        className={`flex flex-col md:flex-row bg-white rounded-xl shadow-lg transition duration-300 overflow-hidden cursor-pointer
            ${isPast
            ? "opacity-60 grayscale"
            : "hover:shadow-2xl hover:scale-[1.01]"
          } border border-gray-100`}
      >
        {/* Event Poster Image */}
        <div className="w-full md:w-1/4 h-48 md:h-auto bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 flex-shrink-0 relative">
          {coverImageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${coverImageUrl})` }}
            >
              {isPast && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xl font-bold p-2 bg-red-600/80 rounded-lg shadow-xl flex items-center">
                    <X className="w-6 h-6 mr-2" /> Attended
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center p-6">
                <Calendar className="h-12 w-12 mx-auto text-purple-400 mb-2" />
                <p className="text-sm font-medium text-purple-600">No Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <h3
              className={`text-2xl font-bold mb-2 ${isPast ? "text-gray-600" : "text-indigo-800"
                }`}
            >
              {title}
            </h3>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                <span className="font-medium text-gray-800">
                  {formattedDate}
                </span>
              </p>
              <p className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                <span className="font-medium text-gray-800">
                  {formattedTime}
                </span>
              </p>
              <p className="flex items-start">
                <MapPin className="w-4 h-4 mt-0.5 mr-2 text-indigo-500 flex-shrink-0" />
                <span>{location || "TBA"}</span>
              </p>
            </div>
          </div>

          {/* Booking Status */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
            <div className="flex items-center space-x-4">
              <p className="flex items-center text-lg font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                <Ticket className="w-5 h-5 mr-2" />
                {numberOfSeats} {numberOfSeats > 1 ? "Tickets" : "Ticket"}
              </p>
              {capacity && (
                <p className="text-sm text-gray-500 flex items-center">
                  <Users className="w-4 h-4 mr-1.5" />
                  Capacity: {capacity}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 pt-0">
          {showFeedbackButton && <GiveFeedbackButton eventId={eventId} />}
        </div>
      </div>
    </Link>
  );
};
>>>>>>> Stashed changes

// Main Booking Page Component
const BookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hasGivenFeedback, setHasGivenFeedback] = useState(false);
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
<<<<<<< Updated upstream
        if (data.success) setBookings(data.bookings);
        else throw new Error(data.message || "Failed to fetch bookings");
=======
        }

        if (data.success) {
          setBookings(data.bookings);
          setHasGivenFeedback(data.hasGivenFeedback);
        } else {
          throw new Error(data.message || "Failed to fetch bookings");
        }
>>>>>>> Stashed changes
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
    return <Loading fullScreen message="Loading your tickets..." />;
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-linear-to-br from-indigo-50/50 via-purple-50/50 to-blue-50/50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none"></div>

<<<<<<< Updated upstream
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
=======
        {/* Upcoming Bookings Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            Upcoming Bookings ({upcomingBookings.length})
          </h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-8">
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  showFeedbackButton={!hasGivenFeedback}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl text-center text-gray-500 border border-dashed border-gray-300">
              <Ticket className="w-8 h-8 mx-auto mb-3" />
              <p className="text-lg font-medium">
                You have no upcoming events booked.
              </p>
              <p className="mt-1">
                Head over to the{" "}
                <Link
                  href="/home"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Events Page
                </Link>{" "}
                to find something exciting!
              </p>
            </div>
          )}
        </section>
>>>>>>> Stashed changes

        <section>
<<<<<<< Updated upstream
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
=======
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            Attended Events ({pastBookings.length})
          </h2>
          {pastBookings.length > 0 ? (
            <div className="space-y-8">
              {pastBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  showFeedbackButton={!hasGivenFeedback}
                />
>>>>>>> Stashed changes
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
