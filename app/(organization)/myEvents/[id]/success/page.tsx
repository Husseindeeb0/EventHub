"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  ArrowRight,
  LayoutDashboard,
  ExternalLink,
  Sparkles as SparklesIcon,
} from "lucide-react";
import { Suspense, use } from "react";

function SuccessContent({ eventId }: { eventId: string }) {
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || "create";

  const isEdit = type === "edit";

  return (
    <div className="w-full max-w-xl relative z-10 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center"
      >
        <div className="mb-10 relative inline-block">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-linear-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/40"
          >
            <CheckCircle2 className="h-12 w-12 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center text-emerald-500"
          >
            <SparklesIcon size={16} />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4"
        >
          {isEdit ? "Changes Saved!" : "Event Live!"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-12"
        >
          {isEdit
            ? "Your event has been successfully updated and your followers have been notified."
            : "Boom! Your new event has been created and broadcast to your followers."}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="overflow-hidden rounded-[3rem] border border-slate-100 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl shadow-2xl premium-shadow"
      >
        <div className="h-2 bg-linear-to-r from-emerald-500 via-teal-500 to-blue-500"></div>
        <div className="p-10 space-y-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={`/home/${eventId}`}
              className="group flex w-full items-center justify-between rounded-2xl bg-linear-to-r from-purple-600 to-blue-600 px-8 py-5 text-base font-bold text-white shadow-xl shadow-purple-500/25 transition-all hover:bg-linear-to-r hover:from-purple-700 hover:to-blue-700"
            >
              <span className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5" />
                View Public Page
              </span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/myEvents"
              className="group flex w-full items-center justify-between rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-8 py-5 text-base font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            >
              <span className="flex items-center gap-3">
                <LayoutDashboard className="w-5 h-5 text-slate-400" />
                Manage Events
              </span>
              <Calendar className="w-5 h-5 text-slate-400" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <Link
          href="/createEvent"
          className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-purple-600 transition-colors"
        >
          + Create Another Event
        </Link>
      </motion.div>
    </div>
  );
}

export default function EventSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.1),transparent_50%)] dark:hidden pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)] dark:hidden pointer-events-none"></div>

      <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
        <SuccessContent eventId={id} />
      </Suspense>
    </main>
  );
}
