"use client";

import { Search, Armchair, Ticket, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Browse Events",
    description: "Explore a wide range of events happening around you.",
    icon: Search,
  },
  {
    title: "Select Your Spot",
    description:
      "Choose your preferred tickets and reserve your place at the event.",
    icon: Armchair,
  },
  {
    title: "Book Instantly",
    description: "Secure your tickets in seconds with our easy checkout.",
    icon: Ticket,
  },
  {
    title: "Attend & Enjoy",
    description: "Get ready for an unforgettable experience.",
    icon: PartyPopper,
  },
];

export function HowItWorks() {
  return (
    <section className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Get started in just a few simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-100 dark:via-indigo-900/40 to-transparent -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white dark:bg-slate-900 rounded-4xl p-8 premium-shadow border border-gray-100 dark:border-slate-800 h-full hover:shadow-[0_20px_60px_-12px_rgba(168,85,247,0.3)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                {/* Faded Number Background */}
                <div className="absolute -right-4 -top-4 text-[8rem] font-bold text-gray-50/80 dark:text-slate-800/80 leading-none select-none pointer-events-none transition-colors duration-500 group-hover:text-indigo-50/50 dark:group-hover:text-indigo-900/30">
                  0{index + 1}
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white dark:bg-slate-950 border-2 border-indigo-50 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:border-indigo-500/20 group-hover:scale-110 transition-all duration-500">
                    <step.icon className="w-8 h-8 text-indigo-600" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
