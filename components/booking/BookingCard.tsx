"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import { Calendar, MapPin, Users, Ticket, Clock, X } from "lucide-react";

// Define the shape of an event (minimal details for the booking page)
interface BookedEvent {
  id: string;
  title: string;
  date: string; // e.g., '2025-12-10'
  time: string; // e.g., '19:00'
  location: string;
  seatsBooked: number;
  capacity: number;
  posterUrl: string; // Placeholder for the event image
}

// Placeholder data - this will be replaced with Redux/Axios fetching
const mockBookings: BookedEvent[] = [
  {
    id: "e1",
    title: "Modern Art Exhibition: The Digital Age",
    date: "2025-12-15",
    time: "14:00",
    location: "City Gallery, Hall 3",
    seatsBooked: 2,
    capacity: 100,
    posterUrl: "/images/art-poster.jpg",
  },
  {
    id: "e2",
    title: "Future of Web Development Conference",
    date: "2025-12-22",
    time: "09:00",
    location: "Tech Hub Convention Center",
    seatsBooked: 1,
    capacity: 500,
    posterUrl: "/images/tech-poster.jpg",
  },
  {
    id: "e3",
    title: "Outdoor Music Festival: Rock Night",
    date: "2025-11-28", // Past event
    time: "20:00",
    location: "Central Park Arena",
    seatsBooked: 3,
    capacity: 5000,
    posterUrl: "/images/music-poster.jpg",
  },
];

// Helper function to check if an event is in the past (based on the date string)
const isPastEvent = (dateString: string) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  // Set time to start of day for accurate date comparison
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
};

// Component for a single booked event card
const BookingCard: React.FC<{ event: BookedEvent }> = ({ event }) => {
  const { title, date, time, location, seatsBooked, capacity, posterUrl } =
    event;
  const isPast = isPastEvent(date);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`flex flex-col md:flex-row bg-white rounded-xl shadow-lg transition duration-300 overflow-hidden 
        ${
          isPast
            ? "opacity-60 grayscale"
            : "hover:shadow-2xl hover:scale-[1.01]"
        } border border-gray-100`}
    >
      {/* Event Poster Image Placeholder */}
      <div className="w-full md:w-1/4 h-48 md:h-auto bg-gray-200 flex-shrink-0 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${posterUrl})` }}
        >
          {isPast && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xl font-bold p-2 bg-red-600/80 rounded-lg shadow-xl flex items-center">
                <X className="w-6 h-6 mr-2" /> Attended
              </span>
            </div>
          )}
        </div>
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
              <span className="font-medium text-gray-800">{formattedDate}</span>
            </p>
            <p className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-indigo-500" />
              <span className="font-medium text-gray-800">{time}</span>
            </p>
            <p className="flex items-start">
              <MapPin className="w-4 h-4 mt-0.5 mr-2 text-indigo-500 flex-shrink-0" />
              <span>{location}</span>
            </p>
          </div>
        </div>

        {/* Booking Status/Action */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
          <div className="flex items-center space-x-4">
            <p className="flex items-center text-lg font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
              <Ticket className="w-5 h-5 mr-2" />
              {seatsBooked} {seatsBooked > 1 ? "Tickets" : "Ticket"}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <Users className="w-4 h-4 mr-1.5" />
              {capacity - (seatsBooked || 0)} seats remaining
            </p>
          </div>

          {!isPast && (
            <button className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition duration-150 text-sm">
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Booking Page Component
const BookingPage = () => {
  // In a real implementation, this would be fetched via Redux/Axios
  const [bookings, setBookings] = useState<BookedEvent[]>(mockBookings);

  // Filter the events into 'Upcoming' and 'Past/Attended'
  const upcomingBookings = bookings.filter((event) => !isPastEvent(event.date));
  const pastBookings = bookings.filter((event) => isPastEvent(event.date));

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
              {upcomingBookings.map((event) => (
                <BookingCard key={event.id} event={event} />
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
                <a
                  href="/home"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Home Page
                </a>{" "}
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
              {pastBookings.map((event) => (
                <BookingCard key={event.id} event={event} />
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
