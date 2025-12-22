"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { rateEventAction } from "@/app/actions";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

export default function RatingModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("rating", rating.toString());
      await rateEventAction(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to submit rating. You may have already rated this event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden text-center"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-yellow-400 to-amber-500"></div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Rate Experience
            </h3>
            <p className="text-sm text-slate-500 mb-8 font-medium line-clamp-1">
              {eventTitle}
            </p>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400 drop-shadow-md"
                        : "fill-slate-100 text-slate-200"
                    } transition-colors duration-200`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            {rating > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-xs font-bold text-amber-500 uppercase tracking-widest"
              >
                {rating === 5
                  ? "Amazing!"
                  : rating === 4
                  ? "Great!"
                  : rating === 3
                  ? "Good"
                  : rating === 2
                  ? "Fair"
                  : "Poor"}
              </motion.p>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
