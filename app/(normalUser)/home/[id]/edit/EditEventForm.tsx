"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { updateEventAction, deleteEventAction } from "@/app/actions";
import { useState } from "react";
import ImageKitUpload from "@/components/imageKit/ImageKitUpload";
import SpeakerManagement, {
  Speaker,
} from "@/components/events/SpeakerManagement";
import ScheduleManagement, {
  ScheduleItem,
} from "@/components/events/ScheduleManagement";
import { DEFAULT_CATEGORIES } from "@/lib/utils";

interface EventData {
  _id: string;
  title: string;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
  startsAt?: Date | string;
  capacity?: number;
  category?: string;
  description?: string;
  coverImageUrl?: string;
  coverImageFileId?: string;
  speakers?: Speaker[];
  schedule?: ScheduleItem[];
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
  const [speakers, setSpeakers] = useState<Speaker[]>(event.speakers || []);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(
    event.schedule || []
  );
  const [isOnline, setIsOnline] = useState(event.isOnline || false);

  const isDefaultCategory =
    event.category &&
    (DEFAULT_CATEGORIES as readonly string[]).includes(event.category);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    isDefaultCategory ? event.category! : "Other"
  );
  const [customCategory, setCustomCategory] = useState(
    isDefaultCategory ? "" : event.category || ""
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
        <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
        <input type="hidden" name="coverImageFileId" value={coverImageFileId} />
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
            required
            defaultValue={event.title}
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-purple-100 bg-purple-50/30">
          <div className="flex items-center h-5">
            <input
              id="isOnline"
              name="isOnline"
              type="checkbox"
              checked={isOnline}
              onChange={(e) => setIsOnline(e.target.checked)}
              className="h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
            />
          </div>
          <div className="text-sm">
            <label htmlFor="isOnline" className="font-semibold text-slate-700">
              This is an online event
            </label>
            <p className="text-slate-500">
              The event will be held via a meeting link (Zoom, Google Meet,
              etc.)
            </p>
          </div>
        </div>

        {!isOnline ? (
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
              required={!isOnline}
              defaultValue={event.location}
              className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor="meetingLink"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Meeting Link
            </label>
            <input
              type="url"
              id="meetingLink"
              name="meetingLink"
              required={isOnline}
              defaultValue={event.meetingLink}
              className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder="e.g. https://zoom.us/j/..."
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Poster Image
          </label>
          <ImageKitUpload
            onSuccess={handleImageUploadSuccess}
            defaultImage={coverImageUrl}
          />
        </div>

        <div>
          <label
            htmlFor="category-select"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Category
          </label>
          <select
            id="category-select"
            required
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Other">Other (Custom)</option>
          </select>

          {selectedCategory === "Other" && (
            <input
              type="text"
              required
              placeholder="Enter custom category name..."
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="mt-3 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          )}
          <input
            type="hidden"
            name="category"
            value={
              selectedCategory === "Other" ? customCategory : selectedCategory
            }
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
            required
            defaultValue={defaultDate}
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="capacity"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Capacity (Optional)
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            min="1"
            defaultValue={event.capacity}
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            placeholder="Leave empty for unlimited"
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

        {/* Speakers Management */}
        <div>
          <SpeakerManagement speakers={speakers} onChange={setSpeakers} />
          <input
            type="hidden"
            name="speakers"
            value={JSON.stringify(speakers)}
          />
        </div>

        {/* Schedule Management */}
        <div>
          <ScheduleManagement schedule={schedule} onChange={setSchedule} />
          <input
            type="hidden"
            name="schedule"
            value={JSON.stringify(schedule)}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row-reverse">
          <SubmitButton />
          <Link
            href={`/home/${event._id}`}
            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:w-auto"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="border-t border-slate-100 bg-slate-50 p-8">
        <h3 className="mb-4 text-sm font-semibold text-red-600">Danger Zone</h3>
        <form
          action={deleteEventAction}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-slate-500">
            Irreversibly delete this event and all its data.
          </p>
          <input type="hidden" name="eventId" value={event._id} />
          <button
            type="submit"
            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Event
          </button>
        </form>
      </div>
    </div>
  );
}
