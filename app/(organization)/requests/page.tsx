"use client";

import {
  useGetRequestsQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
} from "@/redux/features/requests/requestsApi";
import { Check, X, Loader2, Calendar, User, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPageHeader } from "@/components/animations/PageAnimations";

export default function RequestsPage() {
  const { data, isLoading, refetch } = useGetRequestsQuery({});
  const [approveRequest, { isLoading: isApproving }] =
    useApproveRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectRequestMutation();

  const handleApprove = async (id: string) => {
    try {
      await approveRequest(id).unwrap();
    } catch (err: any) {
      alert(err.data?.message || "Failed to approve request");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return;
    try {
      await rejectRequest(id).unwrap();
    } catch (err: any) {
      alert(err.data?.message || "Failed to reject request");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const requests = data?.requests || [];

  return (
    <main className="min-h-[calc(100vh-56px)] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <AnimatedPageHeader>
          <div className="mb-8 uppercase">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Payment <span className="text-purple-600">Requests</span>
            </h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 font-medium normal-case">
              Verify Whish payments and approve booking requests for your paid
              events.
            </p>
          </div>
        </AnimatedPageHeader>

        {requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border-2 border-dashed border-purple-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/90 p-12 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 mb-4">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              All caught up!
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              There are no pending payment requests at the moment.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {requests.map((request: any) => (
                <motion.div
                  key={request._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="overflow-hidden rounded-3xl border border-white dark:border-slate-800 bg-white/70 dark:bg-slate-950 shadow-xl transition-all hover:shadow-2xl hover:bg-white dark:hover:bg-slate-900 premium-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* User Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 overflow-hidden shadow-inner border-2 border-white dark:border-slate-700">
                          {request.userImage ? (
                            <img
                              src={request.userImage}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {request.userName}
                          </h3>
                          <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {request.eventTitle}
                          </p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          <Mail className="h-4 w-4 text-purple-500" />
                          <span className="truncate max-w-[200px]">
                            {request.userEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          <Phone className="h-4 w-4 text-purple-500" />
                          {request.phone}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          <Calendar className="h-4 w-4 text-purple-500" />
                          Requested on{" "}
                          {format(new Date(request.bookedAt), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50 p-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleReject(request._id)}
                        disabled={isApproving || isRejecting}
                        className="flex-1 md:flex-none flex items-center justify-center h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-rose-100 dark:border-rose-900/30 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                        title="Reject Request"
                      >
                        <X className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleApprove(request._id)}
                        disabled={isApproving || isRejecting}
                        className="flex-1 md:flex-none flex items-center justify-center h-12 px-6 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-black uppercase tracking-widest hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 gap-2 cursor-pointer"
                      >
                        {isApproving ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Check className="h-5 w-5" />
                        )}
                        Approve
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
