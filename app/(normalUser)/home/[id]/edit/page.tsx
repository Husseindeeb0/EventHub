import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditEventForm from "./EditEventForm";

async function getEvent(id: string) {
  await connectDb();
  try {
    const event = await Event.findById(id).lean();
    if (!event) return null;

    // Deep serialize the object to ensure all _id's and special types are converted
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    return null;
  }
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = await params;

  const event = await getEvent(eventId);

  if (!event) {
    notFound();
  }

  // Format date for datetime-local input (YYYY-MM-DDThh:mm)
  const defaultDate = event.startsAt
    ? new Date(event.startsAt).toISOString().slice(0, 16)
    : "";

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(124,58,237,0.1),transparent_50%)] dark:hidden pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(37,99,235,0.1),transparent_50%)] dark:hidden pointer-events-none"></div>
      <div className="w-full max-w-xl relative z-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-purple-600 to-blue-600 mb-4 shadow-lg shadow-purple-500/30">
            <svg
              className="h-8 w-8 text-white"
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
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Edit Event
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
            Update your event details or delete it.
          </p>
        </div>

        <EditEventForm event={event} />
      </div>
    </main>
  );
}
