"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import { AnimatedBackground } from "./AnimatedBackground";

export function Hero() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10 pb-20 z-0">
      <AnimatedBackground />

      <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Content */}
        <motion.div
          className="flex-1 flex flex-col items-start gap-8 text-left max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center rounded-full border border-indigo-100/50 px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50/20 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
            The Future of Event Management
          </div>
          <div className="relative group">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-50 leading-[1.1] relative z-20">
              Host Events <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-blue-600 to-indigo-600">
                Like a Pro
              </span>
            </h1>
            {/* Elegant Faded Highlight */}
            <div className="absolute -left-10 -right-20 top-1/2 -translate-y-1/2 h-full w-[120%] bg-radial from-indigo-50/40 via-indigo-50/10 to-transparent blur-2xl -z-10 pointer-events-none" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-400 leading-relaxed max-w-[550px] font-light tracking-wide">
            The all-in-one platform to find your next experience or manage your
            own events with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link href="/home">
              <Button
                size="lg"
                className="h-16 px-10 text-lg cursor-pointer text-white rounded-full bg-indigo-600 hover:bg-indigo-700 premium-button-purple transition-all hover:-translate-y-1 active:scale-95 overflow-hidden group/btn relative"
              >
                <span className="relative z-10">Explore Events</span>
                <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href={isAuthenticated ? "/home" : "/signup"}>
              <Button
                variant="outline"
                size="lg"
                className="h-16 px-10 text-lg rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/10 dark:text-white transition-all"
              >
                Become Organizer
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right Content (Illustration) */}
        <motion.div
          className="flex-1 w-full flex justify-center lg:justify-end relative perspective-1000"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-full max-w-[600px] aspect-4/5 md:aspect-square">
            {/* Main Card */}
            <div className="absolute inset-0 bg-linear-to-tr from-purple-600 to-indigo-600 rounded-[3rem] rotate-3 opacity-10 blur-2xl" />
            <div className="relative h-full w-full bg-white dark:bg-slate-900 rounded-[2.5rem] premium-shadow border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col transform transition-transform hover:scale-[1.02] duration-500">
              {/* Header */}
              <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                    EH
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      EventHub Dashboard
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Overview
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-8 bg-gray-50/50 dark:bg-slate-800/50 space-y-6">
                {/* Chart Area */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        2,543
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Attendees
                      </div>
                    </div>
                    <div className="text-green-500 font-medium bg-green-50 px-3 py-1 rounded-full text-sm">
                      +12.5%
                    </div>
                  </div>
                  <div className="h-32 flex items-end gap-2">
                    {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-indigo-100 dark:bg-slate-700 rounded-t-lg relative group overflow-hidden"
                      >
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-indigo-500 transition-all duration-1000 ease-out rounded-t-lg"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* List Items */}
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          i === 1
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {i === 1 ? "🎉" : "🎫"}
                      </div>
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-gray-100 dark:bg-slate-700 rounded mb-2" />
                        <div className="h-3 w-16 bg-gray-50 dark:bg-slate-800 rounded" />
                      </div>
                      <div className="h-8 w-16 bg-gray-100 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Notification Cards */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-4 lg:-right-16 top-24 bg-white dark:bg-slate-900 p-5 rounded-2xl premium-shadow border border-gray-100 dark:border-slate-800 max-w-[160px] md:max-w-[200px] z-20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  💰
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Sold Out!
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your event "Tech Summit 2025" just reached capacity.
              </p>
            </motion.div>
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute left-4 lg:-left-16 bottom-32 bg-white dark:bg-slate-900 p-5 rounded-2xl premium-shadow border border-gray-100 dark:border-slate-800 flex items-center gap-4 z-20"
            >
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative">
                  <Image
                    src="/images/avatars/avatar1.png"
                    alt="User"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative">
                  <Image
                    src="/images/avatars/avatar2.png"
                    alt="User"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative">
                  <Image
                    src="/images/avatars/avatar3.png"
                    alt="User"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">
                  New Joiners
                </div>
                <div className="text-xs text-muted-foreground">Just now</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
