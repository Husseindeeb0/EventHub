"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { motion } from "framer-motion";
import Image from "next/image";

export function PlatformPurpose() {
  return (
    <section className="py-32 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10 order-2 lg:order-1"
          >
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 leading-tight">
                Why We Built <br />
                <span className="text-indigo-600">EventHub</span>
              </h2>
              <div className="w-24 h-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-full" />
            </div>

            <div className="space-y-8 text-xl text-muted-foreground leading-relaxed font-light">
              <p>
                We believe that gathering together should be joyful, not
                stressful. Existing platforms were too cluttered, too expensive,
                or too hard to use.
              </p>
              <p>
                EventHub was born from a desire to create a space where
                organizers can thrive and attendees can easily find their next
                great memory. We focus on simplicity, transparency, and
                community.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-2 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-3xl font-bold text-gray-900">100%</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Free to Use
                </p>
              </div>
              <div className="space-y-2 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-3xl font-bold text-gray-900">24/7</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Customer Support
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="relative order-1 lg:order-2"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[3rem] rotate-6 opacity-20 blur-2xl" />
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20">
              <AspectRatio ratio={4 / 5} className="bg-muted">
                <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 flex flex-col items-center justify-center text-white p-12 text-center relative overflow-hidden">
                  {/* Decorative Circles */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                  <div className="relative z-10 space-y-8">
                    <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/20 shadow-xl">
                      <div className="text-7xl">🎉</div>
                    </div>
                    <h3 className="text-5xl font-bold">
                      Your Events,
                      <br />
                      Simplified
                    </h3>
                    <p className="text-white/90 text-xl font-light leading-relaxed max-w-md mx-auto">
                      Create, manage, and discover amazing events all in one
                      place.
                    </p>
                  </div>
                </div>
              </AspectRatio>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
