"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import EventImage from "./EventImage";
import { Event } from "@/redux/features/events/eventsApi";

interface EventCardProps {
  e: Event;
  showManage?: boolean;
}

export default function EventCard({ e, showManage = false }: EventCardProps) {
  const full = e.capacity ? e.bookedCount >= e.capacity : false;
  const isFinished = e.endsAt
    ? new Date(e.endsAt) < new Date()
    : e.startsAt
    ? new Date(e.startsAt) < new Date()
    : false;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 ${
        isFinished
          ? "border-slate-100 bg-white"
          : "border-indigo-100 bg-white hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-500/10"
      }`}
    >
      {/* Visual Content Section (No Link) */}
      <div className="flex-1">
        <div className="relative aspect-video w-full overflow-hidden bg-indigo-50">
          {e.coverImageUrl ? (
            <div className="h-full w-full">
              <EventImage src={e.coverImageUrl} alt={e.title} />
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-indigo-100 to-purple-100">
              <div className="text-center p-4">
                <svg
                  className="h-8 w-8 mx-auto text-indigo-400 mb-2 opacity-50"
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
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  Event Hub
                </p>
              </div>
            </div>
          )}

          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider uppercase shadow-sm border ${
                isFinished
                  ? "bg-slate-500 border-slate-600 text-white"
                  : full
                  ? "bg-linear-to-r from-rose-500 to-pink-500 border-rose-600 text-white"
                  : "bg-linear-to-r from-indigo-600 to-purple-600 border-indigo-400 text-white shadow-indigo-200"
              }`}
            >
              {isFinished ? "Ended" : full ? "Sold Out" : "Join Now"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight">
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${
                isFinished
                  ? "text-slate-400 bg-slate-50"
                  : "text-indigo-600 bg-indigo-50"
              }`}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
              }).format(new Date(e.startsAt))}
            </div>
            <div
              className={`${
                isFinished ? "text-slate-300" : "text-slate-400"
              } font-bold`}
            >
              {new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
              }).format(new Date(e.startsAt))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-100">
              {e.category || "Other"}
            </span>
            {isFinished && (
              <div className="flex items-center gap-1 ml-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold text-slate-700">
                  {e.averageRating ? e.averageRating.toFixed(1) : "New"}
                  <span className="text-slate-400 ml-0.5">
                    ({e.ratingCount || 0})
                  </span>
                </span>
              </div>
            )}
          </div>

          <h3
            className={`line-clamp-1 text-base font-black transition-colors duration-300 ${
              isFinished
                ? "text-slate-500"
                : "text-slate-900 group-hover:text-indigo-600"
            }`}
          >
            {e.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isFinished ? "bg-slate-100" : "bg-blue-50"
              }`}
            >
              <svg
                className={`h-3.5 w-3.5 shrink-0 ${
                  isFinished ? "text-slate-400" : "text-blue-500"
                }`}
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
            </div>
            <span
              className={`line-clamp-1 font-bold ${
                isFinished ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {e.location}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-6">
        <div
          className={`flex items-center justify-between border-t pt-5 ${
            isFinished ? "border-slate-100" : "border-indigo-50"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              Bookings
            </span>
            <div className="flex items-center gap-2 text-[13px] font-black text-slate-800">
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
                className={
                  isFinished
                    ? "text-slate-400"
                    : "bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                }
              >
                {e.capacity != null ? (
                  <>
                    {e.bookedCount} <span className="text-slate-300">/</span>{" "}
                    {e.capacity}
                  </>
                ) : (
                  <>
                    {e.bookedCount}{" "}
                    <span className="text-slate-400 font-normal">
                      Registered
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>

          {showManage ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/attendees?eventId=${e.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/40"
                title="View Attendees"
              >
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
                Attendees
              </Link>
              <Link
                href={`/home/${e.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:shadow-purple-500/40"
              >
                Manage
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </Link>
            </div>
          ) : isFinished ? (
            <Link
              href={`/home/${e.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-slate-200 px-5 py-2 text-[11px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-300 shadow-sm"
            >
              Details
            </Link>
          ) : (
            <Link
              href={`/home/${e.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-2 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95 shadow-lg shadow-indigo-100 ring-4 ring-indigo-50"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
