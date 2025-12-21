"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { updateEventAction, deleteEventAction } from "@/app/actions";
import { useState } from "react";
import ImageKitUpload from "@/components/ImageKitUpload";

interface EventData {
  _id: string;
  title: string;
  location?: string;
  startsAt?: Date | string;
  capacity?: number;
  category?: string;
  description?: string;
  coverImageUrl?: string;
  coverImageFileId?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

export default function EditEventForm({ event }: { event: EventData }) {
  const defaultDate = event.startsAt
    ? new Date(event.startsAt).toISOString().slice(0, 16)
    : "";
  const [coverImageUrl, setCoverImageUrl] = useState(event.coverImageUrl || "");
  const [coverImageFileId, setCoverImageFileId] = useState(
    event.coverImageFileId || ""
  );

  const handleImageUploadSuccess = (res: { url: string; fileId: string }) => {
    setCoverImageUrl(res.url);
    setCoverImageFileId(res.fileId);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-2xl shadow-purple-500/10">
      <div className="h-2 bg-linear-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
      <form action={updateEventAction} className="flex flex-col gap-6 p-8">
        <input type="hidden" name="eventId" value={event._id} />
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
            defaultValue={event.location || ""}
            required
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={event.category || "Other"}
            required
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="Music">Music</option>
            <option value="Tech">Tech</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
            <option value="Social">Social</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
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
            defaultValue={
              event.capacity !== undefined && event.capacity !== null
                ? event.capacity
                : ""
            }
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            placeholder="e.g. 100 (leave empty for unlimited)"
          />
          <p className="mt-2 text-xs text-slate-500">
            Leave empty if you want unlimited seats for this event.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Cover Image{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>

          <ImageKitUpload
            onSuccess={handleImageUploadSuccess}
            defaultImage={event.coverImageUrl}
          />

          <input
            type="hidden"
            name="coverImageUrl"
            id="coverImageUrl"
            value={coverImageUrl}
          />
          <input
            type="hidden"
            name="coverImageFileId"
            id="coverImageFileId"
            value={coverImageFileId}
          />
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
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row-reverse">
          <SubmitButton />
          <Link
            href="/myEvents"
            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:w-auto"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="border-t border-purple-200 bg-linear-to-br from-slate-100 via-purple-100/50 to-blue-100/50 p-6">
        <div className="flex items-center justify-end">
          <form action={deleteEventAction}>
            <input type="hidden" name="eventId" value={event._id} />
            <button
              type="submit"
              className="rounded-xl bg-linear-to-r from-red-500 to-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:from-red-600 hover:to-rose-600 hover:shadow-xl hover:shadow-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
