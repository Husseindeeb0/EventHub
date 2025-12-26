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
      status: { $ne: "cancelled" },
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
    <main className="min-h-[calc(100vh-56px)] bg-linear-to-br from-cyan-100/60 via-blue-100/70 to-purple-100/70 dark:bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(6,182,212,0.15),transparent_50%)] dark:hidden pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_80%,rgba(139,92,246,0.15),transparent_50%)] dark:hidden pointer-events-none"></div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl uppercase">
            Event <span className="text-purple-600">Attendees</span>
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 font-medium">
            View and manage attendees for your events.
          </p>
        </div>

        {/* Attendees List */}
        <div>
          {selectedEvent ? (
            <div className="rounded-3xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden premium-shadow">
              <div className="border-b border-purple-100 dark:border-slate-800 bg-linear-to-r from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {selectedEvent.title}
                    </h2>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
                      {attendees.length}{" "}
                      {attendees.length === 1 ? "attendee" : "attendees"}
                    </p>
                  </div>
                  <Link
                    href={`/home/${selectedEvent.id}`}
                    className="w-full sm:w-auto text-center rounded-xl bg-linear-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-lg premium-button-purple"
                  >
                    View Event
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {attendees.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-slate-800 mb-4">
                      <svg
                        className="h-8 w-8 text-purple-600 dark:text-purple-400"
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
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      No attendees yet
                    </h3>
                    <p className="text-sm text-slate-500">
                      This event has no bookings yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attendees.map((attendee, index) => (
                      <div
                        key={attendee.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-purple-100 dark:border-slate-800 bg-linear-to-r from-purple-50/50 to-blue-50/50 dark:from-slate-800/30 dark:to-slate-900/30 p-4 hover:shadow-md dark:shadow-purple-500/10 transition-all gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-blue-600 text-white font-black text-sm shadow-md">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight">
                              {attendee.name}
                            </div>
                            <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                              {attendee.email}
                            </div>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-500">
                              {attendee.phone}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
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
            <div className="rounded-3xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-xl premium-shadow">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-purple-100 dark:bg-purple-900/20 mb-6">
                <svg
                  className="h-10 w-10 text-purple-600 dark:text-purple-400"
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
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-2">
                No event selected
              </h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                Please select an event from your dashboard to view the list of
                attendees.
              </p>
              <Link
                href="/myEvents"
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-purple-600 to-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl premium-button-purple"
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
