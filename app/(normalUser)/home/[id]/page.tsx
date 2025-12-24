import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { notFound } from "next/navigation";
import Link from "next/link";
import BookingForm from "./BookingForm";
import {
  AnimatedHero,
  AnimatedContent,
  AnimatedCard,
  AnimatedSuccessMessage,
} from "./AnimatedEventContent";
import EventImage from "./EventImage";
import EventChat from "@/components/chat/EventChat";
import EventTabs from "@/components/events/EventTabs";
import { getCurrentUser } from "@/lib/serverAuth";
import FollowButton from "@/components/follow/FollowButton";
import AutoDownloadTicket from "@/components/ticket/AutoDownloadTicket";
import FeedbackIntegration from "@/components/feedback/FeedbackIntegration";
import Feedback from "@/models/Feedback";
import GiveFeedbackButton from "@/components/feedback/GiveFeedbackButton";

async function getEvent(id: string) {
  try {
    await connectDb();
    const event = await Event.findById(id).lean();
    if (!event) return null;
    return { ...event, _id: (event._id as any).toString() };
  } catch (error) {
    console.error("Database error in getEvent:", error);
    return null;
  }
}

async function getBookedCount(eventId: string) {
  try {
    await connectDb();
    return await Booking.countDocuments({
      event: eventId,
      status: { $ne: "cancelled" },
    });
  } catch (error) {
    return 0;
  }
}

async function getOrganizerDetails(organizerId: string) {
  try {
    await connectDb();
    const organizer = await User.findById(organizerId)
      .select("name email imageUrl followers")
      .lean();
    if (!organizer) return null;
    return {
      ...organizer,
      _id: (organizer._id as any).toString(),
      followers: (organizer.followers || []).map((id: any) => id.toString()),
    };
  } catch (error) {
    return null;
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
    } as any).format(dateObj);
  } catch (error) {
    return "Date TBA";
  }
}

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
  const event = (await getEvent(resolvedParams.id)) as any;
  const currentUser = await getCurrentUser();

  if (!event) {
    notFound();
  }

  const organizer = (await getOrganizerDetails(event.organizerId)) as any;
  const bookedCount = await getBookedCount(resolvedParams.id);
  const remainingSeats = event.capacity ? event.capacity - bookedCount : null;
  const isFull = event.capacity ? bookedCount >= event.capacity : false;
  const isFinished = event.endsAt
    ? new Date(event.endsAt) < new Date()
    : event.startsAt
    ? new Date(event.startsAt) < new Date()
    : false;

  let userBooking = null;
  let hasFeedback = false;
  if (currentUser) {
    await connectDb();
    userBooking = await Booking.findOne({
      user: currentUser.userId,
      event: resolvedParams.id,
      status: { $ne: "cancelled" },
    }).lean();

    if (userBooking) {
      try {
        const feedbackCount = await Feedback.countDocuments({
          user: currentUser.userId,
          event: resolvedParams.id,
        });
        hasFeedback = feedbackCount > 0;
      } catch (e) {}
    }
  }

  const isFollowing =
    currentUser && organizer
      ? organizer.followers.includes(currentUser.userId)
      : false;

  // --- Content Sections for Tabs ---

  const OverviewContent = (
    <div className="space-y-8">
      {/* Description */}
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

      {/* Speakers Section */}
      {event.speakers && event.speakers.length > 0 && (
        <AnimatedCard delay={0.45}>
          <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-xl shadow-purple-500/5">
            <h2 className="text-2xl font-black bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 uppercase tracking-tight flex items-center gap-2">
              <svg
                className="h-6 w-6 text-purple-600"
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
              Speakers & Presenters
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {event.speakers.map((speaker: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md"
                >
                  {speaker.profileImageUrl ? (
                    <img
                      src={speaker.profileImageUrl}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-200 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl shrink-0">
                      {speaker.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900">{speaker.name}</h3>
                    {speaker.title && (
                      <p className="text-sm font-medium text-purple-600 mb-1">
                        {speaker.title}
                      </p>
                    )}
                    {speaker.bio && (
                      <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                        {speaker.bio}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {speaker.linkedinLink && (
                        <a
                          href={speaker.linkedinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-600"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                      {speaker.instagramLink && (
                        <a
                          href={speaker.instagramLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-pink-600"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.226-.149-4.771-1.664-4.919-4.919-.058-1.265-.069-1.644-.069-4.849 0-3.204.012-3.584.069-4.849.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                      )}
                      {speaker.twitterLink && (
                        <a
                          href={speaker.twitterLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-sky-500"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>
      )}
    </div>
  );

  const ScheduleContent = (
    <div className="space-y-6">
      <AnimatedCard delay={0.2}>
        <div className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-xl shadow-indigo-500/5">
          <h2 className="text-2xl font-black bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 uppercase tracking-tight flex items-center gap-2">
            <svg
              className="h-6 w-6 text-indigo-600"
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
            Event Schedule
          </h2>
          <div className="space-y-4">
            {event.schedule
              ?.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))
              .map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                >
                  <div className="w-24 shrink-0 flex flex-col items-center">
                    <span className="font-bold text-lg text-indigo-600">
                      {item.startTime}
                    </span>
                    {item.endTime && (
                      <span className="text-xs text-slate-400">
                        {item.endTime}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.type !== "session" && (
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                            item.type === "break"
                              ? "bg-amber-100 text-amber-600"
                              : item.type === "opening"
                              ? "bg-green-100 text-green-600"
                              : item.type === "closing"
                              ? "bg-red-100 text-red-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.type}
                        </span>
                      )}
                      <h3 className="font-bold text-slate-900 text-lg leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    {item.presenter && (
                      <p className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-1">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {item.presenter}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-slate-600 text-sm">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </AnimatedCard>
    </div>
  );

  const ChatContent = (
    <AnimatedCard delay={0.2}>
      <div className="mt-2 h-[600px] flex flex-col">
        <EventChat
          eventId={event._id}
          organizerId={event.organizerId}
          currentUserId={currentUser?.userId}
        />
      </div>
    </AnimatedCard>
  );

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
        <div className="relative h-[450px] w-full overflow-hidden bg-linear-to-br from-purple-200 via-blue-200 to-indigo-200">
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
            <div className="mx-auto w-full max-w-7xl pointer-events-auto">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {event.category && (
                    <span className="inline-flex items-center rounded-full bg-indigo-500/80 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-widest text-white ring-1 ring-white/20 shadow-lg">
                      {event.category}
                    </span>
                  )}
                  {isFinished && (
                    <span className="inline-flex items-center rounded-full bg-slate-500/80 backdrop-blur-md px-4 py-1 text-xs font-black uppercase tracking-widest text-white ring-1 ring-white/20">
                      This Event has Ended
                    </span>
                  )}
                </div>
                <h1
                  className={`text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg ${
                    isFinished ? "opacity-80" : ""
                  }`}
                >
                  {event.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </AnimatedHero>

      <AnimatedContent>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
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

          {resolvedSearchParams?.booked === "true" && userBooking && (
            <AutoDownloadTicket
              event={{
                title: event.title,
                location: event.location,
                startsAt:
                  event.startsAt && new Date(event.startsAt).toISOString(),
                description: event.description,
                coverImageUrl: event.coverImageUrl,
                isOnline: event.isOnline,
                meetingLink: event.meetingLink,
                organizer: organizer
                  ? {
                      _id: organizer._id,
                      name: organizer.name,
                      email: organizer.email,
                      imageUrl: organizer.imageUrl,
                    }
                  : null,
              }}
              booking={{
                _id: userBooking._id.toString(),
                name: userBooking.name,
                phone: userBooking.phone,
                userId: userBooking.user.toString(),
                seats: userBooking.seats,
                numberOfSeats: userBooking.seats,
              }}
            />
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

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Info Bar */}
              <AnimatedCard delay={0.3}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 rounded-2xl bg-white/60 backdrop-blur-md p-4 shadow-sm border border-white/50">
                  {/* Date & Time */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
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
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-purple-400">
                        Date & Time
                      </p>
                      <p className="font-semibold text-slate-800">
                        {formatEventDate(event.startsAt)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      {event.isOnline ? (
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
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      ) : (
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
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-blue-400">
                        {event.isOnline ? "Event Type" : "Location"}
                      </p>
                      {event.isOnline ? (
                        userBooking ? (
                          <a
                            href={event.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                          >
                            Join Meeting
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        ) : (
                          <p className="font-semibold text-slate-800">
                            Online Event
                          </p>
                        )
                      ) : (
                        <p className="font-semibold text-slate-800 line-clamp-1">
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Organizer & Follow */}
                  {organizer && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100/50 sm:col-span-2 lg:col-span-1 min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {organizer.imageUrl ? (
                          <img
                            src={organizer.imageUrl}
                            alt={organizer.name}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-100 shrink-0"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-sm">
                            {organizer.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 pr-2">
                          <p className="text-[9px] font-black uppercase text-indigo-400 tracking-wider leading-none mb-0.5">
                            Organizer
                          </p>
                          <Link
                            href={`/organizers/${organizer._id}`}
                            className="font-bold text-slate-800 hover:text-indigo-600 transition-colors truncate block text-sm"
                          >
                            {organizer.name}
                          </Link>
                        </div>
                      </div>
                      {currentUser && currentUser.userId !== organizer._id && (
                        <div className="shrink-0 scale-90 origin-right">
                          <FollowButton
                            organizerId={organizer._id}
                            initialIsFollowing={isFollowing}
                            initialFollowerCount={organizer.followers.length}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </AnimatedCard>

              {/* Tabs Content */}
              <EventTabs
                overviewContent={OverviewContent}
                scheduleContent={ScheduleContent}
                chatContent={ChatContent}
                hasSchedule={!!(event.schedule && event.schedule.length > 0)}
                hasSpeakers={!!(event.speakers && event.speakers.length > 0)}
              />
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
                    <div className="space-y-4">
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

                      {/* Show feedback button for past events if booked & no existing feedback */}
                      {userBooking && !hasFeedback && (
                        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-4 mb-3 text-center">
                            <p className="text-xs text-indigo-700 font-medium">
                              This event has ended. We'd love to hear your
                              thoughts!
                            </p>
                          </div>
                          <GiveFeedbackButton eventId={event._id} />
                        </div>
                      )}
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

      {/* Feedback Section Overlay (Show after booking or via button) */}
      {userBooking && (
        <FeedbackIntegration bookingId={userBooking?._id?.toString()} />
      )}
    </main>
  );
}
