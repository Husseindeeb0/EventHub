"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const icons = [
  // Music Note
  <path d="M9 18V5l12-2v13" />,
  <circle cx="6" cy="18" r="3" />,
  <circle cx="18" cy="16" r="3" />,
  // Calendar
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />,
  <line x1="16" y1="2" x2="16" y2="6" />,
  <line x1="8" y1="2" x2="8" y2="6" />,
  <line x1="3" y1="10" x2="21" y2="10" />,
  // Ticket
  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />,
  <line x1="13" y1="5" x2="13" y2="19" />,
  // Star
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  // Mic
  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />,
  <path d="M19 10v1a7 7 0 0 1-14 0v-1" />,
  <line x1="12" y1="19" x2="12" y2="22" />,
];

const iconColors = [
  "text-blue-500/20", // 0: Booking
  "text-rose-500/20", // 1: Save
  "text-amber-500/20", // 2: Organizers
  "text-emerald-500/20", // 3: Connection
  "text-purple-500/20", // 4: Event
  "text-sky-500/20", // 5: Meetings
];

const Shape = ({ delay, duration, x, y, size, iconIndex }: any) => (
  <motion.div
    initial={{ opacity: 0.5, scale: 1 }}
    animate={{
      y: [0, -15, 0], // Subtle jumping motion
    }}
    transition={{
      duration: 3 + Math.random() * 2, // Varied jumping speed
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
    className={`absolute pointer-events-none ${
      iconColors[iconIndex] || "text-indigo-500/20"
    }`}
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
    }}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      {/* 0: Booking / Calendar Check */}
      {iconIndex === 0 && (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="m9 16 2 2 4-4" />
        </>
      )}
      {/* 1: Save / Heart */}
      {iconIndex === 1 && (
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      )}
      {/* 2: Organizers / Users */}
      {iconIndex === 2 && (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      )}
      {/* 3: Connection / Network */}
      {iconIndex === 3 && (
        <>
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="9" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="15" />
          <line x1="9" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="15" y2="12" />
          <circle cx="12" cy="3" r="1" />
          <circle cx="12" cy="21" r="1" />
          <circle cx="3" cy="12" r="1" />
          <circle cx="21" cy="12" r="1" />
        </>
      )}
      {/* 4: Event / Ticket */}
      {iconIndex === 4 && (
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      )}
      {/* 5: Meetings / Speech Bubbles */}
      {iconIndex === 5 && (
        <>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </>
      )}
    </svg>
  </motion.div>
);

const Wave = ({ color, d, duration, delay }: any) => (
  <motion.path
    d={d}
    fill="none"
    stroke={color}
    strokeWidth="2"
    initial={{ opacity: 0.5 }}
    animate={{
      x: [-20, 20, -20], // Subtle horizontal sway
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  />
);

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Decorative Gradient Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),transparent_60%)]" />

      {/* Animated Shapes/Icons - Increased count and optimized distribution */}
      <div className="absolute inset-0 z-0">
        {/* Left Side (Most visible) */}
        <Shape x={5} y={15} size={45} delay={0} duration={14} iconIndex={0} />
        <Shape x={15} y={45} size={35} delay={2} duration={18} iconIndex={2} />
        <Shape x={8} y={75} size={50} delay={4} duration={22} iconIndex={3} />
        <Shape x={25} y={10} size={40} delay={1} duration={16} iconIndex={5} />
        <Shape x={20} y={60} size={30} delay={3} duration={19} iconIndex={1} />

        {/* Middle/Center */}
        <Shape x={45} y={25} size={40} delay={5} duration={20} iconIndex={4} />
        <Shape
          x={50}
          y={80}
          size={45}
          delay={2.5}
          duration={15}
          iconIndex={0}
        />
        <Shape
          x={35}
          y={50}
          size={35}
          delay={1.5}
          duration={21}
          iconIndex={2}
        />
        <Shape x={55} y={5} size={30} delay={4} duration={17} iconIndex={3} />

        {/* Right Side (Peeking from behind the component) */}
        <Shape x={85} y={10} size={35} delay={3} duration={14} iconIndex={5} />
        <Shape
          x={75}
          y={50}
          size={40}
          delay={0.5}
          duration={18}
          iconIndex={1}
        />
        <Shape x={90} y={85} size={50} delay={2} duration={20} iconIndex={4} />
        <Shape
          x={70}
          y={20}
          size={30}
          delay={1.5}
          duration={23}
          iconIndex={0}
        />
        <Shape x={80} y={70} size={35} delay={4} duration={16} iconIndex={2} />

        {/* Extra Bottom Row */}
        <Shape
          x={30}
          y={90}
          size={40}
          delay={3.5}
          duration={18}
          iconIndex={5}
        />
        <Shape x={65} y={95} size={35} delay={1} duration={21} iconIndex={1} />
      </div>

      {/* Animated Waves */}
      <svg
        className="absolute w-full h-full opacity-60 z-0"
        preserveAspectRatio="none"
      >
        <Wave
          color="rgba(99, 102, 241, 0.4)"
          d="M-100 150 Q 250 50 500 150 T 1100 150"
          duration={20}
          delay={0}
        />
        <Wave
          color="rgba(168, 85, 247, 0.4)"
          d="M-100 250 Q 250 150 500 250 T 1100 250"
          duration={25}
          delay={2}
        />
        <Wave
          color="rgba(16, 185, 129, 0.4)"
          d="M-100 350 Q 250 250 500 350 T 1100 350"
          duration={22}
          delay={5}
        />
      </svg>

      {/* Subtle Mesh Gradient / Soften Layer */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[15px] -z-10" />
    </div>
  );
};
