"use client";

import { MapPin, Ticket, Clock } from "lucide-react";
import Link from "next/link";
import DownloadTicketButton from "../ticket/DownloadTicketButton";

// Define the shape of a booking
export interface Booking {
  _id: string;
  eventId: string;
  title: string;
  location: string;
  startsAt: string; // ISO date string
  endsAt?: string; // ISO date string
  coverImageUrl?: string;
  capacity?: number;
  description?: string;
  numberOfSeats: number;
  bookedAt: string;
  name?: string;
  email?: string;
  phone?: string;
  userId?: string;
  organizer?: {
    _id: string;
    name: string;
    email: string;
    imageUrl?: string;
  };
}

// Component for a single booked event card
const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
  const {
    title,
    location,
    startsAt,
    endsAt,
    coverImageUrl,
    numberOfSeats,
    eventId,
  } = booking;

  const now = new Date();
  const isFinished = endsAt
    ? new Date(endsAt) < now
    : startsAt
    ? new Date(startsAt) < now
    : false;

  const dateObj = startsAt ? new Date(startsAt) : null;
  const isValidDate = dateObj && !isNaN(dateObj.getTime());

  const day = isValidDate ? dateObj.getDate() : "TBA";
  const month = isValidDate
    ? dateObj.toLocaleDateString("en-US", { month: "short" })
    : "";
  const time = isValidDate
    ? dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Time TBA";

  return (
    <div
      className={`group relative flex flex-col md:flex-row overflow-hidden rounded-3xl border transition-all duration-500 ${
        isFinished
          ? "border-slate-100 bg-white"
          : "border-indigo-100 bg-white hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-500/10"
      }`}
    >
      {/* Left: Image Section */}
      <div className="relative w-full md:w-64 lg:w-80 h-48 md:h-auto overflow-hidden bg-indigo-50 shrink-0">
        {coverImageUrl ? (
          <div className="h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-indigo-100 to-purple-100 uppercase">
            <div className="text-center p-4">
              <Ticket className="h-8 w-8 mx-auto text-indigo-400 mb-2 opacity-50" />
              <p className="text-[10px] font-black tracking-widest text-indigo-400">
                Event Hub
              </p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider uppercase shadow-sm border ${
              isFinished
                ? "bg-slate-500 border-slate-600 text-white"
                : "bg-linear-to-r from-indigo-600 to-purple-600 border-indigo-400 text-white shadow-indigo-200"
            }`}
          >
            {isFinished ? "Attended" : "Confirmed"}
          </span>
        </div>
      </div>

      {/* Right: Content Section */}
      <div className="flex flex-1 flex-col p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex gap-4 items-center">
            {/* Date Box */}
            <div
              className={`flex flex-col items-center justify-center w-12 h-14 rounded-2xl border ${
                isFinished
                  ? "border-slate-100 bg-slate-50"
                  : "border-indigo-100 bg-indigo-50/50"
              }`}
            >
              <span
                className={`text-xs font-black uppercase ${
                  isFinished ? "text-slate-400" : "text-indigo-600"
                }`}
              >
                {month}
              </span>
              <span
                className={`text-xl font-black ${
                  isFinished ? "text-slate-500" : "text-slate-900"
                }`}
              >
                {day}
              </span>
            </div>

            <div>
              <h3
                className={`text-xl font-black transition-colors duration-300 line-clamp-1 ${
                  isFinished
                    ? "text-slate-500"
                    : "text-slate-900 group-hover:text-indigo-600"
                }`}
              >
                {title}
              </h3>
              <div
                className={`flex items-center gap-1.5 text-xs font-bold mt-1 ${
                  isFinished ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <Clock
                  className={`w-3.5 h-3.5 ${
                    isFinished ? "text-slate-300" : "text-indigo-500"
                  }`}
                />
                {time}
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
              isFinished
                ? "border-slate-100 bg-slate-50 text-slate-400"
                : "border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/10"
            }`}
          >
            <Ticket
              className={`w-4 h-4 ${
                isFinished ? "text-slate-300" : "text-emerald-500"
              }`}
            />
            <span className="text-sm font-black uppercase tracking-tight">
              {numberOfSeats} {numberOfSeats > 1 ? "Tickets" : "Ticket"}
            </span>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 text-sm font-bold mb-6 ${
            isFinished ? "text-slate-400" : "text-slate-600"
          }`}
        >
          <MapPin
            className={`w-4 h-4 ${
              isFinished ? "text-slate-300" : "text-indigo-500"
            }`}
          />
          <span className="line-clamp-1">{location || "TBA"}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="iconGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <path
                d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C14.2142E-01 16.9217 0 17.9391 0 19V21"
                stroke={isFinished ? "#cbd5e1" : "url(#iconGradient)"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                stroke={isFinished ? "#cbd5e1" : "url(#iconGradient)"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23 21V19C22.9993 18.1137 22.7044 17.2524 22.1614 16.5523C21.6184 15.8522 20.8581 15.3516 20 15.13"
                stroke={isFinished ? "#cbd5e1" : "url(#iconGradient)"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25393 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75607 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88"
                stroke={isFinished ? "#cbd5e1" : "url(#iconGradient)"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className={`text-[11px] font-black uppercase tracking-widest ${
                isFinished ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Confirmed Spot
            </span>
          </div>

          <Link
            href={`/home/${eventId}`}
            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              isFinished
                ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                : "bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-100"
            }`}
          >
            {isFinished ? "Details" : "Event Page"}
          </Link>

          {!isFinished && (
            <DownloadTicketButton
              event={{
                title: booking.title,
                location: booking.location,
                startsAt: booking.startsAt,
                description: booking.description,
                coverImageUrl: booking.coverImageUrl,
                organizer: booking.organizer,
              }}
              booking={{
                _id: booking._id,
                name: booking.name,
                phone: booking.phone,
                userId: booking.userId,
                seats: booking.numberOfSeats, // Ensure mapping handles existing bookings
                numberOfSeats: booking.numberOfSeats,
              }}
              label="Ticket"
              className="px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all bg-white border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 flex items-center gap-2 cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
