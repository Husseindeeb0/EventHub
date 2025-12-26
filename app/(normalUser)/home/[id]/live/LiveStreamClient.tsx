"use client";

import { motion } from "framer-motion";
import EventChat from "@/components/chat/EventChat";
import Link from "next/link";
import {
  ChevronLeft,
  Info,
  Calendar,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

interface LiveStreamClientProps {
  event: {
    _id: string;
    title: string;
    category?: string;
    description?: string;
    liveStreamUrl: string;
    organizerId: string;
    schedule?: Array<{
      title: string;
      startTime: string;
      presenter?: string;
    }>;
  };
  youtubeId: string | null;
  currentUserId?: string;
}

export default function LiveStreamClient({
  event,
  youtubeId,
  currentUserId,
}: LiveStreamClientProps) {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-100 via-indigo-100/60 via-purple-100/70 to-pink-100/50 dark:bg-transparent relative overflow-hidden flex flex-col">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.18),transparent_50%)] dark:hidden pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.18),transparent_50%)] dark:hidden pointer-events-none"></div>

      {/* Top Bar */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-purple-200/50 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md z-20 relative">
        <div className="flex items-center gap-4">
          <Link
            href={`/home/${event._id}`}
            className="p-2 hover:bg-purple-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="font-bold text-lg line-clamp-1 text-slate-900 dark:text-white">
              {event.title}
            </h1>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-red-500">
                Live
              </span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-200 dark:border-purple-800">
            {event.category}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden relative z-10">
        {/* Main Content Area (Video + Details) */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Section */}
          <div className="relative w-full aspect-video bg-black shadow-2xl rounded-b-3xl overflow-hidden">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-900">
                <ExternalLink className="w-16 h-16 mb-4 opacity-20 text-white" />
                <h2 className="text-xl font-bold mb-2 text-white">
                  External Stream
                </h2>
                <p className="max-w-md text-slate-300">
                  This live stream cannot be embedded directly. Please watch it
                  on the source platform.
                </p>
                <a
                  href={event.liveStreamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-lg"
                >
                  Open Live Stream
                </a>
              </div>
            )}
          </div>

          {/* Event Info below video */}
          <div className="p-6 lg:p-10 space-y-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {event.category && (
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-black uppercase tracking-widest border border-purple-200">
                        {event.category}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                      Live Stream
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {event.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-purple-100 dark:border-slate-800 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
                      <Info className="w-5 h-5" />
                      <h3 className="font-black uppercase tracking-widest text-sm">
                        About
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">
                      {event.description || "No description provided."}
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-purple-100 dark:border-slate-800 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center gap-3 mb-4 text-purple-600 dark:text-purple-400">
                      <Calendar className="w-5 h-5" />
                      <h3 className="font-black uppercase tracking-widest text-sm text-purple-600 dark:text-purple-400">
                        Schedule
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {event.schedule && event.schedule.length > 0 ? (
                        event.schedule
                          .sort((a, b) =>
                            a.startTime.localeCompare(b.startTime)
                          )
                          .map((item, idx) => (
                            <div
                              key={idx}
                              className="flex gap-3 justify-between items-center text-sm border-b border-purple-100 dark:border-slate-800 pb-2 last:border-0 last:pb-0"
                            >
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  {item.title}
                                </span>
                                {item.presenter && (
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {item.presenter}
                                  </span>
                                )}
                              </div>
                              <span className="font-black text-indigo-600 whitespace-nowrap">
                                {item.startTime}
                              </span>
                            </div>
                          ))
                      ) : (
                        <p className="text-slate-500 text-sm italic">
                          No schedule items available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-[400px] xl:w-[450px] border-l border-purple-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col">
          <div className="p-4 border-b border-purple-200/50 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-black uppercase tracking-widest text-sm text-slate-800 dark:text-gray-200">
              Live Discussion
            </h3>
          </div>
          <div className="flex-1 overflow-hidden h-[500px] lg:h-auto">
            <div className="h-full flex flex-col p-4">
              <div className="flex-1 rounded-2xl overflow-hidden border border-purple-100 dark:border-slate-800 shadow-xl">
                <EventChat
                  eventId={event._id}
                  organizerId={event.organizerId}
                  currentUserId={currentUserId}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
