"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitFeedbackMutation } from "@/redux/features/feedback/feedbackApi";

export default function GeneralFeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("ui");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [submitFeedback, { isLoading: isSubmitting }] =
    useSubmitFeedbackMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorMessage("Please select a rating");
      setStatus("error");
      return;
    }

    setStatus("idle");

    try {
      const data = await submitFeedback({
        type: "general",
        rating,
        comment,
        category,
      }).unwrap();

      if (data.success) {
        setStatus("success");
        setErrorMessage("");
      } else {
        setErrorMessage(data.message || "Failed to submit feedback");
        setStatus("error");
      }
    } catch (error: any) {
      setErrorMessage(
        error.data?.message || "Something went wrong. Please try again."
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <main className="min-h-screen dark:bg-transparent flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Thank You!
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Your feedback has been submitted successfully. We appreciate your
            input to help us improve the app!
          </p>

          <div className="pt-4">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 premium-button-purple transition"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Info Sidebar */}
        <div className="bg-linear-to-b from-indigo-600 to-purple-600 p-8 text-white md:w-1/3 flex flex-col justify-between">
          <div>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-purple-100 hover:text-white transition mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-3xl font-bold mb-4">Feedback Center</h1>
            <p className="text-purple-100 leading-relaxed">
              Tell us what you think about EventHub! Your feedback helps us
              build a better experience for everyone.
            </p>
          </div>
          <div className="hidden md:block mt-8 opacity-20">
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="100" fill="white" />
            </svg>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 md:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Message */}
            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rating */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Overall Experience
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        (hover || rating) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-200"
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                What category does your feedback fall into?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["ui", "performance", "features", "bugs", "other"].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        category === cat
                          ? "bg-linear-to-r from-indigo-600 to-purple-600 border-indigo-600 text-white premium-button-purple"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Your detailed feedback
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What's on your mind? We'd love to hear your thoughts, suggestions, or issues..."
                className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-slate-700 dark:text-white placeholder:text-slate-400"
                maxLength={500}
              />
              <div className="text-right text-xs text-slate-400 mt-1">
                {comment.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed premium-button-purple"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-slate-400 italic">
              For specific event issues, please use the feedback form on the
              event's booking page.
            </p>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
