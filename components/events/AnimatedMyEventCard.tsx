"use client";

import Link from "next/link";
import { AnimatedCard } from "@/components/animations/PageAnimations";

type MyEventVM = {
    id: string;
    title: string;
    location: string;
    startsAt: string;
    coverImageUrl?: string;
    capacity?: number;
    bookedCount: number;
};

export default function AnimatedMyEventCard({ e, index }: { e: MyEventVM; index: number }) {
    const isFull = e.capacity != null && e.bookedCount >= e.capacity;

    return (
        <AnimatedCard delay={index * 0.1}>
            <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
                <Link href={`/events/${e.id}`} className="flex-1">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100">
                        {e.coverImageUrl ? (
                            <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={e.coverImageUrl}
                                    alt={e.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            </>
                        ) : (
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="text-center p-6">
                                    <svg className="h-12 w-12 mx-auto text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm font-medium text-purple-600">No Image</p>
                                </div>
                            </div>
                        )}
                        <div className="absolute top-4 right-4">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${
                                isFull 
                                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white" 
                                    : "bg-white/90 text-purple-700 backdrop-blur-sm"
                            }`}>
                                {isFull ? "Sold Out" : "Available"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 p-6">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1.5 text-purple-700">
                                <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                            <svg className="h-4 w-4 shrink-0 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="line-clamp-1 font-medium">{e.location}</span>
                        </div>
                    </div>
                </Link>

                <div className="border-t border-purple-100 bg-gradient-to-r from-purple-50/50 to-blue-50/50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <span>
                                {e.capacity != null 
                                    ? `${e.bookedCount} / ${e.capacity} bookings` 
                                    : `${e.bookedCount} bookings`}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href={`/attendees?eventId=${e.id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/40"
                                title="View Attendees"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Attendees
                            </Link>
                            <Link
                                href={`/events/${e.id}/edit`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:shadow-purple-500/40"
                            >
                                Manage
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedCard>
    );
}

