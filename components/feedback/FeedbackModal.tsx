"use client";

import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
}

import { useSubmitFeedbackMutation } from "@/redux/features/feedback/feedbackApi";

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  bookingId,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const router = useRouter();

  const [submitFeedback, { isLoading: isSubmitting }] =
    useSubmitFeedbackMutation();

  const handleSubmit = async () => {
    if (rating === 0) return;

    try {
      await submitFeedback({
        bookingId,
        rating,
        comment,
      }).unwrap();

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        router.refresh(); // Refresh to remove query params if we navigate or just to update state
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
        >
          {/* Close Button */}
          {!submitted && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="p-8 text-center">
            {submitted ? (
              <div className="py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Thank You!</h3>
                <p className="text-gray-600">
                  Your feedback helps us improve the experience for everyone.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  How was your booking?
                </h2>
                <p className="text-gray-600 mb-8">
                  Since this is your first booking, we'd love to hear about your
                  experience!
                </p>

                {/* Star Rating */}
                <div className="flex justify-center space-x-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Comment Area */}
                <div className="mb-6">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us more (optional)..."
                    className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none h-32"
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {comment.length}/500
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                    className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/30 transition-all 
                      ${
                        rating === 0
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/40"
                      }
                    `}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                  <button
                    onClick={onClose}
                    className="text-sm text-gray-500 hover:text-gray-700 py-2"
                  >
                    Skip for now
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
