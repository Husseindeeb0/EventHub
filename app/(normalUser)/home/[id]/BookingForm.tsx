"use client";

import { useState } from "react";
import {
  useBookEventMutation,
  useCancelBookingMutation,
} from "@/redux/features/bookings/bookingsApi";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookingForm({
  eventId,
  initialBooking,
  isPaid,
  price,
  whishNumber,
}: {
  eventId: string;
  initialBooking?: any;
  isPaid?: boolean;
  price?: number;
  whishNumber?: string;
}) {
  const router = useRouter();
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [bookEvent, { isLoading: isBooking }] = useBookEventMutation();
  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();

  const handleWhishPay = () => {
    const whishUrl = `https://whish.money/pay/${encodeURIComponent(
      whishNumber || ""
    )}?amount=${price}`;
    window.open(whishUrl, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await bookEvent({ eventId, ...formData, seats: 1 }).unwrap();
      if (isPaid) {
        router.push(`?requestSent=true`);
      } else {
        router.push(`?booked=true`);
      }
      router.refresh();
    } catch (error: any) {
      alert(
        error.data?.message ||
          `Failed to ${isPaid ? "send request" : "book event"}`
      );
    }
  };

  const handleCancel = async () => {
    if (!initialBooking?._id) return;
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelBooking(initialBooking._id).unwrap();
      router.push(`?cancelled=true`);
      router.refresh();
    } catch (error: any) {
      alert(error.data?.message || "Failed to cancel booking");
    }
  };

  if (initialBooking && !isResubmitting) {
    const isPending = initialBooking.status === "pending";
    const isRejected = initialBooking.status === "rejected";

    return (
      <div className="space-y-6">
        <div
          className={`rounded-xl border p-4 shadow-sm ${
            isPending
              ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50"
              : isRejected
              ? "bg-red-50 dark:bg-rose-900/10 border-red-200 dark:border-rose-800/50"
              : "bg-green-50 dark:bg-emerald-900/10 border-green-200 dark:border-emerald-800/50"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isPending
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                  : isRejected
                  ? "bg-red-100 dark:bg-rose-900/30 text-red-600 dark:text-rose-400"
                  : "bg-green-100 dark:bg-emerald-900/30 text-green-600 dark:text-emerald-400"
              }`}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isRejected ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </div>
            <h4
              className={`font-semibold ${
                isPending
                  ? "text-amber-900 dark:text-amber-200"
                  : isRejected
                  ? "text-red-900 dark:text-rose-200"
                  : "text-green-900 dark:text-emerald-200"
              }`}
            >
              {isPending
                ? "Request Pending"
                : isRejected
                ? "Request Rejected"
                : "Booking Confirmed"}
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {isPending
              ? "Your request has been sent to the organizer for approval. They will verify your payment and confirm your booking."
              : isRejected
              ? "Your booking request was rejected by the organizer."
              : "You're all set! Your spot has been reserved."}
          </p>
        </div>

        {!isRejected && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="w-full rounded-xl bg-red-50 dark:bg-rose-900/10 px-6 py-3 text-sm font-semibold text-red-600 dark:text-rose-400 border border-red-200 dark:border-rose-900/30 shadow-sm transition-all hover:bg-red-100 dark:hover:bg-rose-900/20 hover:border-red-300 dark:hover:border-rose-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isCancelling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isPending ? "Withdrawing..." : "Cancelling..."}
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                {isPending ? "Withdraw Request" : "Cancel Booking"}
              </>
            )}
          </button>
        )}

        {isRejected && (
          <button
            onClick={async () => {
              // First delete the rejected booking so we can create a new one
              try {
                await cancelBooking(initialBooking._id).unwrap();
                setIsResubmitting(true);
              } catch (err: any) {
                alert(err.data?.message || "Failed to reset request");
              }
            }}
            className="w-full rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Loader2
              className={`h-4 w-4 animate-spin ${
                isCancelling ? "block" : "hidden"
              }`}
            />
            Try Again / Resubmit
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="John Doe"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-xs"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            placeholder="john@example.com"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-xs"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-xs"
          />
        </div>
      </div>

      <div className="space-y-3">
        {isPaid && (
          <>
            <button
              type="button"
              onClick={handleWhishPay}
              className="w-full rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-amber-500/30 hover:from-amber-600 hover:to-orange-600 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86l-2.04-1.2c-.19-.11-.42-.11-.61 0l-2.04 1.2c-.19.11-.31.31-.31.53v2.4c0 .22.12.42.31.53l2.04 1.2c.19.11.42.11.61 0l2.04-1.2c.19-.11.31-.31.31-.53v-2.4c0-.22-.12-.42-.31-.53z" />
              </svg>
              Step 1: Pay via Whish
            </button>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3">
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold text-center leading-tight">
                ⚠️ IMPORTANT: Send a request only AFTER you are sure of payment.
                The organizer will verify your transfer.
              </p>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isBooking}
          className={`w-full rounded-xl px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
            isPaid
              ? "bg-linear-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-500/40 focus:ring-emerald-500"
              : "bg-linear-to-r from-purple-600 to-blue-600 shadow-purple-500/30 hover:from-purple-700 hover:to-blue-700 hover:shadow-purple-500/40 focus:ring-purple-500"
          }`}
        >
          {isBooking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isPaid ? "Sending Request..." : "Booking..."}
            </>
          ) : isPaid ? (
            "Step 2: Send Booking Request"
          ) : (
            "Reserve Your Spot"
          )}
        </button>
      </div>
    </form>
  );
}
