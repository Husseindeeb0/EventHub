"use client";

import { useAppSelector } from "@/redux/store";
import {
  AnimatedPageHeader,
  AnimatedPageContent,
} from "@/components/animations/PageAnimations";
import {
  Code2,
  Heart,
  Globe,
  Users,
  Calendar,
  Building2,
  Linkedin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const teamMembers = [
    {
      name: "Hussein Deeb",
      role: "Founder & Lead Developer",
      icon: Users,
      bgClass: "bg-indigo-50",
      iconClass: "text-indigo-600",
      linkedinUrl: "https://www.linkedin.com/in/hussein-deeb0/",
    },
    {
      name: "Ali Ghaith",
      role: "UI/UX Specialist",
      icon: Code2,
      bgClass: "bg-blue-50",
      iconClass: "text-blue-600",
      linkedinUrl: "#",
    },
    {
      name: "Hadi Deeb",
      role: "Front-End Architect",
      icon: Code2,
      bgClass: "bg-cyan-50",
      iconClass: "text-cyan-600",
      linkedinUrl: "https://www.linkedin.com/in/hadi-deeb-3772a7317/",
    },
    {
      name: "Houssam Yakhni",
      role: "Backend Engineer",
      icon: Globe,
      bgClass: "bg-purple-50",
      iconClass: "text-purple-600",
      linkedinUrl: "#",
    },
    {
      name: "Marwan Nhle",
      role: "System Designer",
      icon: Code2,
      bgClass: "bg-teal-50",
      iconClass: "text-teal-600",
      linkedinUrl: "#",
    },
    {
      name: "Abass",
      role: "Creative Developer",
      icon: Code2,
      bgClass: "bg-pink-50",
      iconClass: "text-pink-600",
      linkedinUrl: "#",
    },
  ];

  const stats = [
    {
      name: "Universities Partnered",
      value: "10+",
      icon: Building2,
      colorClass:
        "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      name: "Active Students",
      value: "500+",
      icon: Users,
      colorClass:
        "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    },
    {
      name: "Events Hosted",
      value: "100+",
      icon: Calendar,
      colorClass:
        "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    },
    {
      name: "Successful Bookings",
      value: "1k+",
      icon: Sparkles,
      colorClass:
        "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
    },
  ];

  const values = [
    {
      title: "Community First",
      description:
        "We build tools that bring people together, creating meaningful connections that last beyond the event.",
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      title: "Seamless Experience",
      description:
        "Technology should be invisible. We focus on creating a frictionless journey from discovery to attendance.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Trust & Reliability",
      description:
        "Every booking and every interaction is secured with industry-leading standards you can count on.",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-transparent selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(99,102,241,0.08)_0%,rgba(255,255,255,0)_100%)]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedPageHeader>
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-600/10 dark:ring-indigo-400/20 mb-6">
                Our Story
              </span>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-7xl mb-8 leading-[1.1]">
                Empowering Every{" "}
                <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Student Moment
                </span>
              </h1>
              <p className="text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300 mb-10">
                {isAuthenticated && user?.name
                  ? `Hi ${user.name.split(" ")[0]}, `
                  : ""}
                EventHub was born from a simple idea: that campus life should be
                vibrant, accessible, and unforgettable. We've built the ultimate
                platform for hosting and discovering experiences that shape your
                university journey.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/home"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold premium-button-purple hover:bg-indigo-700 transition-all flex items-center gap-2 group"
                >
                  Explore Events
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {!isAuthenticated && (
                  <Link
                    href="/signup"
                    className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Join the Community
                  </Link>
                )}
              </div>
            </div>
          </AnimatedPageHeader>
        </div>
      </section>

      <AnimatedPageContent>
        {/* Stats Section */}
        <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="h-full bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 premium-shadow border border-slate-100/50 dark:border-slate-800/50 transition-all duration-500 hover:shadow-[0_20px_60px_-12px_rgba(168,85,247,0.3)] flex flex-col items-center text-center">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${stat.colorClass} group-hover:scale-110`}
                    >
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {stat.name}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 sm:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-4">
                  Our Mission
                </h2>
                <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
                  Bridging the Gap Between{" "}
                  <span className="text-indigo-600">Campus</span> &{" "}
                  <span className="text-purple-600">Career</span>
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  We believe that what happens outside the classroom is just as
                  important as what happens inside. EventHub provides organizers
                  with professional tools to host seamless experiences, while
                  giving students a central hub to discover opportunities that
                  matter.
                </p>
                <div className="space-y-6">
                  {values.map((v) => (
                    <div key={v.title} className="flex gap-4">
                      <div
                        className={`shrink-0 w-12 h-12 rounded-xl ${v.bg} dark:bg-slate-800 flex items-center justify-center`}
                      >
                        <v.icon className={`w-6 h-6 ${v.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          {v.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {v.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-[3rem] -rotate-2 -z-10" />
                <div className="relative aspect-square rounded-[2.5rem] bg-indigo-600 overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"
                    alt="Community"
                    fill
                    className="object-cover opacity-80 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-indigo-900/50 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <p className="text-2xl font-black text-white leading-tight">
                      "Connecting minds, one event at a time."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
          <div className="mx-auto max-max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-4">
                The Creators
              </h2>
              <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
                Meet the Team
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="relative h-full bg-white dark:bg-slate-950 rounded-3xl p-8 premium-shadow border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-12px_rgba(168,85,247,0.3)]">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${member.bgClass} dark:bg-slate-800`}
                      >
                        <member.icon
                          className={`w-10 h-10 ${member.iconClass}`}
                        />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                        {member.name}
                      </h4>
                      <p className="text-sm font-bold text-indigo-600 mb-4">
                        {member.role}
                      </p>

                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-[#0077b5] dark:hover:bg-[#0077b5] hover:text-white rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 transition-all duration-300"
                      >
                        <Linkedin className="w-4 h-4" />
                        Connect
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="relative bg-indigo-600 rounded-[3rem] p-12 sm:p-20 overflow-hidden text-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-6xl font-black text-white mb-8">
                  Ready to start your journey?
                </h2>
                <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto">
                  Join hundreds of students and organizers already shaping the
                  campus experience on EventHub.
                </p>
                <Link
                  href={isAuthenticated ? "/home" : "/signup"}
                  className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest premium-button-purple hover:scale-105 active:scale-95 transition-all"
                >
                  Get Started Now
                  <Sparkles className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedPageContent>
    </div>
  );
}
