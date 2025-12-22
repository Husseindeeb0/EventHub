"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EventTabsProps {
  overviewContent: React.ReactNode;
  scheduleContent?: React.ReactNode;
  speakersContent?: React.ReactNode;
  chatContent: React.ReactNode;
  hasSchedule: boolean;
  hasSpeakers: boolean;
}

export default function EventTabs({
  overviewContent,
  scheduleContent,
  speakersContent,
  chatContent,
  hasSchedule,
  hasSpeakers,
}: EventTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "chat">(
    "overview"
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: OverviewIcon },
    ...(hasSchedule
      ? [{ id: "schedule", label: "Schedule", icon: ScheduleIcon }]
      : []),
    { id: "chat", label: "Discussion", icon: ChatIcon },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100/80 backdrop-blur-sm rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? "text-white shadow-md shadow-purple-500/20"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <tab.icon
                className={`w-4 h-4 ${
                  activeTab === tab.id ? "text-white" : "text-current"
                }`}
              />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-8">
                {overviewContent}
                {/* Show speakers in overview if no dedicated tab/or just show them here regardless? 
                    Let's show speakers in overview as requested by "display all details"
                    But we also have dedicated variable if we want.
                */}
                {speakersContent}
              </div>
            )}
            {activeTab === "schedule" && scheduleContent}
            {activeTab === "chat" && chatContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function OverviewIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ScheduleIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function ChatIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    </svg>
  );
}
