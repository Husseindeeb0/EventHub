import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import Booking from "@/models/Booking";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/serverAuth";

async function getEventAttendees(eventId: string) {
  await connectDb();
  try {
    const attendees = await Booking.find({ 
      event: eventId,
      status: { $ne: "cancelled" }
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();
    return attendees.map((a: any) => {
       // Use populated user data if available, otherwise use booking data
       const userName = a.user?.name || a.name || "Unknown";
       const userEmail = a.user?.email || a.email || "N/A";
       
      return {
        id: a._id.toString(),
        name: userName,
        email: userEmail,
        phone: a.phone || "N/A",
        bookedAt: a.createdAt || a.bookingDate,
      };
    });
  } catch (error) {
    return [];
  }
}

export default async function AttendeesPage({
  searchParams,
}: {
  searchParams: Promise<{ eventId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const eventId = resolvedSearchParams.eventId;

  let selectedEvent = null;
  let attendees: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    bookedAt: any;
  }> = [];

  if (eventId) {
    const event = await Event.findById(eventId).lean();
    if (event) {
      selectedEvent = {
        id: event._id.toString(),
        title: event.title || "Untitled Event",
      };
      attendees = await getEventAttendees(eventId);
    }
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-cyan-100/60 via-blue-100/70 via-indigo-100/60 to-purple-100/70 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_80%,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl">
            Event Attendees
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            View and manage attendees for your events.
          </p>
        </div>

        {/* Attendees List */}
        <div>
            {selectedEvent ? (
              <div className="rounded-3xl border border-purple-100 bg-white shadow-xl">
                <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {selectedEvent.title}
                      </h2>
                      <p className="text-sm text-slate-600 mt-1">
                        {attendees.length}{" "}
                        {attendees.length === 1 ? "attendee" : "attendees"}
                      </p>
                    </div>
                    <Link
                      href={`/home/${selectedEvent.id}`}
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-lg"
                    >
                      View Event
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  {attendees.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                        <svg
                          className="h-8 w-8 text-purple-600"
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
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        No attendees yet
                      </h3>
                      <p className="text-sm text-slate-500">
                        This event has no bookings yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {attendees.map((attendee, index) => (
                        <div
                          key={attendee.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50/50 to-blue-50/50 p-4 hover:shadow-md transition-all gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-sm shadow-md">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {attendee.name}
                              </div>
                              <div className="text-sm text-slate-600">
                                {attendee.email}
                              </div>
                              <div className="text-sm text-slate-500">
                                {attendee.phone}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 whitespace-nowrap">
                            Booked on{" "}
                            {attendee.bookedAt
                              ? new Date(attendee.bookedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )
                              : "N/A"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                  <svg
                    className="h-8 w-8 text-purple-600"
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
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No event selected
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Please select an event to view attendees.
                </p>
                <Link
                  href="/myEvents"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-lg"
                >
                  Go to My Events
                </Link>
              </div>
            )}
        </div>
      </div>
    </main>
  );
}
