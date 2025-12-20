import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import Booking from "@/models/Booking";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";
import {
  AnimatedHero,
  AnimatedContent,
  AnimatedCard,
  AnimatedSuccessMessage,
} from "./AnimatedEventContent";
import EventImage from "./EventImage";
import EventChat from "@/components/chat/EventChat";

async function getEvent(id: string) {
  await connectDb();
  try {
    const event = await Event.findById(id).lean();
    if (!event) return null;
    return { ...event, _id: event._id.toString() };
  } catch (error) {
    return null;
  }
}

async function getBookedCount(eventId: string) {
  await connectDb();
  try {
    return await Booking.countDocuments({
      event: eventId,
      status: { $ne: "cancelled" },
    });
  } catch (error) {
    return 0;
  }
}

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

import { getCurrentUser } from "@/lib/serverAuth";

export default async function EventDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }> | { id: string };
  searchParams:
    | Promise<{ booked?: string; cancelled?: string }>
    | { booked?: string; cancelled?: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const event = await getEvent(resolvedParams.id);
  const currentUser = await getCurrentUser();

  if (!event) {
    notFound();
  }

  const bookedCount = await getBookedCount(resolvedParams.id);
  const remainingSeats = event.capacity ? event.capacity - bookedCount : null;
  const isFull = event.capacity ? bookedCount >= event.capacity : false;
  const isFinished = event.endsAt
    ? new Date(event.endsAt) < new Date()
    : event.startsAt
    ? new Date(event.startsAt) < new Date()
    : false;

  let userBooking = null;
  if (currentUser) {
    await connectDb();
    userBooking = await Booking.findOne({
      user: currentUser.userId,
      event: resolvedParams.id,
      status: { $ne: "cancelled" },
    }).lean();
  }

  return (
    <main
      className={`min-h-screen relative overflow-hidden ${
        isFinished
          ? "grayscale-sm bg-slate-100"
          : "bg-linear-to-br from-indigo-100/70 via-purple-100/80 to-blue-100/90"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none"></div>
      {/* Hero Section */}
      <AnimatedHero>
        <div className="relative h-[500px] w-full overflow-hidden bg-linear-to-br from-purple-200 via-blue-200 to-indigo-200">
          {event.coverImageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <EventImage
                src={event.coverImageUrl}
                alt={event.title}
                className={isFinished ? "opacity-40 grayscale" : ""}
              />
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
            <div
              className={`absolute inset-0 bg-linear-to-t pointer-events-none ${
                isFinished
                  ? "from-slate-900/90 via-slate-800/70"
                  : "from-purple-900/90 via-purple-800/70"
              } to-transparent`}
            ></div>
          )}
          <div className="absolute inset-0 flex items-end p-8 sm:p-12 pointer-events-none">
            <div className="mx-auto w-full max-w-5xl pointer-events-auto">
              <div className="flex flex-col gap-4">
                {isFinished && (
                  <div className="flex">
                    <span className="inline-flex items-center rounded-full bg-slate-500/80 backdrop-blur-md px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white ring-1 ring-white/20">
                      This Event has Ended
                    </span>
                  </div>
                )}
                <h1
                  className={`text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg ${
                    isFinished ? "opacity-80" : ""
                  }`}
                >
                  {event.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-6 text-white/90">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <svg
                      className="h-5 w-5 text-purple-200"
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
                      className="h-5 w-5 text-blue-200"
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
        </div>
      </AnimatedHero>

      <AnimatedContent>
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
          {/* Messages */}
          {resolvedSearchParams?.booked === "true" && (
            <AnimatedSuccessMessage>
              <div className="mb-8 rounded-2xl bg-linear-to-r from-green-500 to-emerald-500 p-6 text-white shadow-lg ring-4 ring-green-100">
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
                    <h3 className="text-lg font-bold uppercase tracking-tight">
                      Booking Confirmed!
                    </h3>
                    <p className="text-sm font-medium text-white/90">
                      You've successfully booked a spot for this event.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSuccessMessage>
          )}

          {resolvedSearchParams?.cancelled === "true" && (
            <AnimatedSuccessMessage>
              <div className="mb-8 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 p-6 text-white shadow-lg ring-4 ring-rose-100">
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
                    <h3 className="text-lg font-bold uppercase tracking-tight">
                      Booking Cancelled
                    </h3>
                    <p className="text-sm font-medium text-white/90">
                      Your booking has been successfully cancelled.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSuccessMessage>
          )}

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedCard delay={0.4}>
                <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-xl shadow-purple-500/5">
                  <h2 className="text-2xl font-black bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 uppercase tracking-tight">
                    About this event
                  </h2>
                  {event.description ? (
                    <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line font-medium">
                      {event.description}
                    </p>
                  ) : (
                    <p className="text-lg leading-relaxed text-slate-400 italic font-medium">
                      No description provided for this event.
                    </p>
                  )}
                </div>
              </AnimatedCard>

              {/* Event Chat */}
              <AnimatedCard delay={0.5}>
                <div className="mt-8">
                  <EventChat
                    eventId={event._id}
                    organizerId={event.organizerId}
                    currentUserId={currentUser?.userId}
                  />
                </div>
              </AnimatedCard>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <AnimatedCard delay={0.6}>
                <div
                  className={`sticky top-24 rounded-3xl border p-8 shadow-2xl transition-all ${
                    isFinished
                      ? "border-slate-200 bg-slate-50/50 shadow-slate-200/50"
                      : "border-purple-100 bg-white shadow-purple-500/10 ring-1 ring-purple-50"
                  }`}
                >
                  <h3
                    className={`text-xl font-black mb-8 uppercase tracking-widest ${
                      isFinished ? "text-slate-400" : "text-slate-900"
                    }`}
                  >
                    {isFinished
                      ? "Event Status"
                      : userBooking
                      ? "Your Booking"
                      : "Reserve Spot"}
                  </h3>

                  <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-indigo-50">
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                        Attendance
                      </span>
                      <span
                        className={`text-[13px] font-black ${
                          isFinished ? "text-slate-400" : "text-indigo-600"
                        }`}
                      >
                        {isFinished ? "Closed" : "Free Entry"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                        Total Booked
                      </span>
                      <span
                        className={`text-[13px] font-black ${
                          isFull
                            ? "text-rose-600"
                            : isFinished
                            ? "text-slate-500"
                            : "text-slate-900"
                        }`}
                      >
                        {event.capacity != null ? (
                          <>
                            {bookedCount}{" "}
                            <span className="text-slate-300">/</span>{" "}
                            {event.capacity}
                          </>
                        ) : (
                          bookedCount
                        )}
                      </span>
                    </div>
                  </div>

                  {isFinished ? (
                    <div className="rounded-2xl bg-slate-100 border-2 border-slate-200 p-6 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-600 uppercase tracking-widest">
                            Event Finished
                          </p>
                          <p className="text-xs text-slate-400 font-bold">
                            Booking is no longer available.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : isFull && !userBooking ? (
                    <div className="rounded-2xl bg-rose-50 border-2 border-rose-100 p-6 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-rose-600 uppercase tracking-widest">
                            Sold Out
                          </p>
                          <p className="text-xs text-rose-400 font-bold">
                            Join the waitlist or check later.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <BookingForm
                      eventId={resolvedParams.id}
                      initialBooking={
                        userBooking
                          ? JSON.parse(JSON.stringify(userBooking))
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
