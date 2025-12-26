"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { updateEventAction, deleteEventAction } from "@/app/actions";
import { useState } from "react";
import { motion } from "framer-motion";
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
  liveStreamUrl?: string;
  isPaid?: boolean;
  price?: number;
  whishNumber?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto premium-button-purple"
    >
      {pending ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Saving...
        </>
      ) : (
        "Save Changes"
      )}
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
  const [isPaid, setIsPaid] = useState(event.isPaid || false);
  const [price, setPrice] = useState(event.price?.toString() || "0");
  const [whishNumber, setWhishNumber] = useState(event.whishNumber || "");

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
    <div className="overflow-hidden rounded-3xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-purple-500/10 premium-shadow">
      <div className="h-2 bg-linear-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
      <form action={updateEventAction} className="flex flex-col gap-6 p-8">
        <input type="hidden" name="eventId" value={event._id} />
        <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
        <input type="hidden" name="coverImageFileId" value={coverImageFileId} />
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
          >
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={event.title}
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-purple-100 dark:border-slate-800 bg-purple-50/30 dark:bg-slate-800/30">
          <div className="flex items-center h-5">
            <input
              id="isOnline"
              name="isOnline"
              type="checkbox"
              checked={isOnline}
              onChange={(e) => setIsOnline(e.target.checked)}
              className="h-5 w-5 rounded border-purple-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 dark:bg-slate-700"
            />
          </div>
          <div className="text-sm">
            <label
              htmlFor="isOnline"
              className="font-semibold text-slate-700 dark:text-slate-200"
            >
              This is an online event
            </label>
            <p className="text-slate-500 dark:text-slate-400">
              The event will be held via a meeting link (Zoom, Google Meet,
              etc.)
            </p>
          </div>
        </div>

        {!isOnline ? (
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required={!isOnline}
              defaultValue={event.location}
              className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor="meetingLink"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
            >
              Meeting Link
            </label>
            <input
              type="url"
              id="meetingLink"
              name="meetingLink"
              required={isOnline}
              defaultValue={event.meetingLink}
              className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="liveStreamUrl"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
          >
            YouTube Live Stream Link{" "}
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              (Optional)
            </span>
          </label>
          <input
            type="url"
            id="liveStreamUrl"
            name="liveStreamUrl"
            defaultValue={event.liveStreamUrl}
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
            placeholder="e.g. https://www.youtube.com/watch?v=..."
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Share a YouTube live link to allow people to watch the event
            directly from our website.
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-purple-100 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-900/10">
          <div className="flex items-center h-5">
            <input
              id="isPaid"
              name="isPaid"
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className="h-5 w-5 rounded border-purple-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 dark:bg-slate-700"
            />
          </div>
          <div className="text-sm">
            <label
              htmlFor="isPaid"
              className="font-semibold text-slate-700 dark:text-slate-200"
            >
              This is a paid event
            </label>
            <p className="text-slate-500 dark:text-slate-400">
              Attendees will need to pay via Whish to book a spot.
            </p>
          </div>
        </div>

        {isPaid && (
          <>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.1 }}
            >
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
              >
                Ticket Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required={isPaid}
                min="1"
                step="0.01"
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
                placeholder="e.g. 20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.15 }}
            >
              <label
                htmlFor="whishNumber"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
              >
                Whish Number for Payment
              </label>
              <input
                type="tel"
                id="whishNumber"
                name="whishNumber"
                value={whishNumber}
                onChange={(e) => setWhishNumber(e.target.value)}
                required={isPaid}
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
                placeholder="e.g. 70123456"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                This is the phone number attendees will send the money to via
                Whish.
              </p>
            </motion.div>
          </>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
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
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
          >
            Category
          </label>
          <select
            id="category-select"
            required
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="dark:bg-slate-900">
                {cat}
              </option>
            ))}
            <option value="Other" className="dark:bg-slate-900">
              Other (Custom)
            </option>
          </select>

          {selectedCategory === "Other" && (
            <input
              type="text"
              required
              placeholder="Enter custom category name..."
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="mt-3 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
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
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
          >
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            id="startsAt"
            name="startsAt"
            required
            defaultValue={defaultDate}
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="capacity"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
          >
            Capacity (Optional)
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            min="1"
            defaultValue={event.capacity}
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
            placeholder="Leave empty for unlimited"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
          >
            Event Description{" "}
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              (Optional)
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={event.description || ""}
            className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none text-slate-900 dark:text-white"
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
            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-800 focus:ring-offset-2 sm:w-auto"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 p-8">
        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-red-600">
          Danger Zone
        </h3>
        <form
          action={deleteEventAction}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Irreversibly delete this event and all its data.
          </p>
          <input type="hidden" name="eventId" value={event._id} />
          <button
            type="submit"
            className="rounded-xl border border-red-200 dark:border-rose-900/50 bg-white dark:bg-rose-950/10 px-4 py-2 text-sm font-semibold text-red-600 dark:text-rose-400 transition-all hover:bg-red-50 dark:hover:bg-rose-900/20 hover:border-red-300 dark:hover:border-rose-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
          >
            Delete Event
          </button>
        </form>
      </div>
    </div>
  );
}
