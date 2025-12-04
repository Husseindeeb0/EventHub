import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import { notFound } from "next/navigation";
import { updateEventAction, deleteEventAction } from "@/app/actions";
import Link from "next/link";

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
  const defaultDate = new Date(event.startsAt).toISOString().slice(0, 16);

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gradient-to-br from-violet-100 via-purple-100 via-indigo-100 to-blue-100 p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(124,58,237,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(37,99,235,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="w-full max-w-xl relative z-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 mb-4 shadow-lg shadow-purple-500/30">
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
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Edit Event
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Update your event details or delete it.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-2xl shadow-purple-500/10">
          <div className="h-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
          <form action={updateEventAction} className="flex flex-col gap-6 p-8">
            <input type="hidden" name="eventId" value={eventId} />
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={event.title}
                required
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                defaultValue={event.location}
                required
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="startsAt"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                id="startsAt"
                name="startsAt"
                defaultValue={defaultDate}
                required
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Number of Seats{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                min="1"
                step="1"
                defaultValue={event.capacity || ""}
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="e.g. 100 (leave empty for unlimited)"
              />
              <p className="mt-2 text-xs text-slate-500">
                Leave empty if you want unlimited seats for this event.
              </p>
            </div>

            <div>
              <label
                htmlFor="coverImageUrl"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Cover Image URL{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                id="coverImageUrl"
                name="coverImageUrl"
                defaultValue={event.coverImageUrl || ""}
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-2 text-xs text-slate-500">
                Add a cover image URL for your event. If left empty, a clean
                gradient background will be displayed.
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Event Description{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={event.description || ""}
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                placeholder="Describe your event... What will attendees experience? What should they expect?"
              />
              <p className="mt-2 text-xs text-slate-500">
                Provide details about your event to help attendees understand
                what to expect.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
              >
                Save Changes
              </button>
              <Link
                href="/myEvents"
                className="inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:w-auto"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="border-t border-purple-200 bg-gradient-to-br from-slate-100 via-purple-100/50 to-blue-100/50 p-6">
            <div className="flex items-center justify-end">
              <form action={deleteEventAction}>
                <input type="hidden" name="eventId" value={eventId} />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:from-red-600 hover:to-rose-600 hover:shadow-xl hover:shadow-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete Event
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
