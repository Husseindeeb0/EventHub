"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-100/30 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[100px] -z-10" />

      <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Content */}
        <motion.div
          className="flex-1 flex flex-col items-start gap-8 text-left max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center rounded-full border border-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50/50 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
            The Future of Event Management
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-gray-900 leading-[1.1]">
            Host Events <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
              Like a Pro
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-[600px] font-light">
            The all-in-one platform to find your next experience or manage your
            own events with ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto pt-6">
            <Link href="/home">
              <Button
                size="lg"
                className="h-16 px-10 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all hover:-translate-y-1 text-white"
              >
                Explore Events
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="h-16 px-10 text-lg rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Become Organizer
            </Button>
          </div>
        </motion.div>

        {/* Right Content (Illustration) */}
        <motion.div
          className="flex-1 w-full flex justify-center lg:justify-end relative perspective-1000"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-full max-w-[600px] aspect-[4/5] md:aspect-square">
            {/* Main Card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[3rem] rotate-3 opacity-10 blur-2xl" />
            <div className="relative h-full w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col transform transition-transform hover:scale-[1.02] duration-500">
              {/* Header */}
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                    EH
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
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
              <div className="flex-1 p-8 bg-gray-50/50 space-y-6">
                {/* Chart Area */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
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
                        className="flex-1 bg-indigo-100 rounded-t-lg relative group overflow-hidden"
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
                      className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
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
                        <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
                        <div className="h-3 w-16 bg-gray-50 rounded" />
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
              className="absolute -right-12 top-24 bg-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 max-w-[200px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  💰
                </div>
                <span className="text-sm font-bold text-gray-900">
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
              className="absolute -left-12 bottom-32 bg-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center gap-4"
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
                <div className="font-bold text-gray-900 text-sm">
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
