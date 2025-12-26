"use client";

import Link from "next/link";
import { createEventAction } from "@/app/actions";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import ImageKitUpload from "@/components/imageKit/ImageKitUpload";
import SpeakerManagement, {
  Speaker,
} from "@/components/events/SpeakerManagement";
import ScheduleManagement, {
  ScheduleItem,
} from "@/components/events/ScheduleManagement";
import { useState } from "react";
import { DEFAULT_CATEGORIES } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
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
          Creating...
        </>
      ) : (
        "Create Event"
      )}
    </motion.button>
  );
}

export default function CreateEventPage() {
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageFileId, setCoverImageFileId] = useState("");
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    DEFAULT_CATEGORIES[0]
  );
  const [customCategory, setCustomCategory] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("0");
  const [whishNumber, setWhishNumber] = useState("");

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_50%)] dark:hidden pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)] dark:hidden pointer-events-none"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-purple-600 to-blue-600 mb-4 shadow-lg shadow-purple-500/30"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold tracking-tight bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            Create Event
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-lg text-slate-600 dark:text-slate-300"
          >
            Fill in the details to publish your new event.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-purple-500/10 premium-shadow"
        >
          <div className="h-2 bg-linear-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
          <form action={createEventAction} className="flex flex-col gap-6 p-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
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
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
                placeholder="e.g. Deployment Masterclass"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-purple-100 dark:border-slate-800 bg-purple-50/30 dark:bg-slate-800/30"
            >
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
            </motion.div>

            {!isOnline ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
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
                  className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
                  placeholder="e.g. Beirut, Lebanon"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
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
                  className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
                  placeholder="e.g. https://zoom.us/j/..."
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
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
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
                placeholder="e.g. https://www.youtube.com/watch?v=..."
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Share a YouTube live link to allow people to watch the event
                directly from our website.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.72 }}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-purple-100 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-900/10"
            >
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
            </motion.div>

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
                    This is the phone number attendees will send the money to
                    via Whish.
                  </p>
                </motion.div>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 }}
            >
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
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  type="text"
                  required
                  placeholder="Enter custom category name..."
                  value={customCategory}
                  onChange={(e) => customCategory}
                  className="mt-3 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
                />
              )}
              <input
                type="hidden"
                name="category"
                value={
                  selectedCategory === "Other"
                    ? customCategory
                    : selectedCategory
                }
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
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
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 }}
            >
              <label
                htmlFor="endsAt"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
              >
                End Date & Time{" "}
                <span className="text-slate-400 dark:text-slate-500 font-normal">
                  (Optional)
                </span>
              </label>
              <input
                type="datetime-local"
                id="endsAt"
                name="endsAt"
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label
                htmlFor="capacity"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
              >
                Number of Seats{" "}
                <span className="text-slate-400 dark:text-slate-500 font-normal">
                  (Optional)
                </span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                min="1"
                step="1"
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
                placeholder="e.g. 100 (leave empty for unlimited)"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Leave empty if you want unlimited seats for this event.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Cover Image{" "}
                <span className="text-slate-400 dark:text-slate-500 font-normal">
                  (Optional)
                </span>
              </label>

              <ImageKitUpload
                onSuccess={(res) => {
                  setCoverImageUrl(res.url);
                  setCoverImageFileId(res.fileId);
                }}
              />
              <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
              <input
                type="hidden"
                name="coverImageFileId"
                value={coverImageFileId}
              />

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Upload a cover image for your event. If left empty, a clean
                gradient background will be displayed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
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
                className="mt-2 block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none text-slate-900 dark:text-white"
                placeholder="Describe your event... What will attendees experience? What should they expect?"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Provide details about your event to help attendees understand
                what to expect.
              </p>
            </motion.div>

            {/* Speakers Management */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.15 }}
            >
              <SpeakerManagement speakers={speakers} onChange={setSpeakers} />
              <input
                type="hidden"
                name="speakers"
                value={JSON.stringify(speakers)}
              />
            </motion.div>

            {/* Schedule Management */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <ScheduleManagement schedule={schedule} onChange={setSchedule} />
              <input
                type="hidden"
                name="schedule"
                value={JSON.stringify(schedule)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-4 flex flex-col gap-3 sm:flex-row-reverse"
            >
              <SubmitButton />
              <Link
                href="/myEvents"
                className="inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-800 focus:ring-offset-2 sm:w-auto"
              >
                Cancel
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </main>
  );
}
