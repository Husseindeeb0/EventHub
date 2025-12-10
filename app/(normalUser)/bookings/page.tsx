"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Ticket, Clock, X } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define the shape of a booking
interface Booking {
  _id: string;
  eventId: string;
  title: string;
  location: string;
  startsAt: string; // ISO date string
  coverImageUrl?: string;
  capacity?: number;
  description?: string;
  numberOfSeats: number;
  bookedAt: string;
}

// Helper function to check if an event is in the past
const isPastEvent = (dateString: string) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
};

// Component for a single booked event card
const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
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
            ${
              isPast
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
              className={`text-2xl font-bold mb-2 ${
                isPast ? "text-gray-600" : "text-indigo-800"
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
      </div>
    </Link>
  );
};

// Main Booking Page Component
const BookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Fetch bookings
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/bookings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        if (data.success) {
          setBookings(data.bookings);
        } else {
          throw new Error(data.message || "Failed to fetch bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, router]);

  // Filter the events into 'Upcoming' and 'Past/Attended'
  const upcomingBookings = bookings.filter(
    (booking) => !isPastEvent(booking.startsAt)
  );
  const pastBookings = bookings.filter((booking) =>
    isPastEvent(booking.startsAt)
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Your Booked Events
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Manage your upcoming reservations and view your attended events.
        </p>

        {/* Upcoming Bookings Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            Upcoming Bookings ({upcomingBookings.length})
          </h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-8">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
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

        <hr className="my-10 border-t border-gray-200" />

        {/* Past Bookings Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            Attended Events ({pastBookings.length})
          </h2>
          {pastBookings.length > 0 ? (
            <div className="space-y-8">
              {pastBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl text-center text-gray-500 border border-dashed border-gray-300">
              <p className="text-lg font-medium">
                Once you attend an event, it will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default BookingPage;
