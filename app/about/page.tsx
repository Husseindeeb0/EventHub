"use client";

import { useAppSelector } from "@/redux/store/store";
import {
  AnimatedPageHeader,
  AnimatedPageContent,
} from "@/components/animations/PageAnimations";
import {
  Code2,
  GraduationCap,
  Rocket,
  Heart,
  Globe,
  Users,
  Calendar,
  Building2,
  Linkedin,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const teamMembers = [
    {
      name: "Hussein Deeb",
      role: "Team Leader",
      icon: Users,
      bgClass: "bg-indigo-50",
      iconClass: "text-indigo-600",
      linkedinUrl: "####",
    },
    {
      name: "Ali Ghaith",
      role: "Front End",
      icon: Code2,
      bgClass: "bg-blue-50",
      iconClass: "text-blue-600",
      linkedinUrl: "####",
    },
    {
      name: "Hadi Deeb",
      role: "Front End",
      icon: Code2,
      bgClass: "bg-cyan-50",
      iconClass: "text-cyan-600",
      linkedinUrl: "####",
    },
    {
      name: "Houssam Yakhni",
      role: "Full Stack",
      icon: Globe,
      bgClass: "bg-purple-50",
      iconClass: "text-purple-600",
      linkedinUrl: "####",
    },
    {
      name: "Marwan Nhle",
      role: "Front End",
      icon: Code2,
      bgClass: "bg-teal-50",
      iconClass: "text-teal-600",
      linkedinUrl: "####",
    },
    {
      name: "Abass",
      role: "Front End",
      icon: Code2,
      bgClass: "bg-pink-50",
      iconClass: "text-pink-600",
      linkedinUrl: "####",
    },
  ];

  const techStack = [
    {
      name: "Next.js 16",
      description: "Latest App Router & Server Actions",
      icon: Globe,
      // Outline style (Image 2)
      bgClass: "bg-white border-4 border-blue-500",
      iconClass: "text-blue-500",
    },
    {
      name: "React 19",
      description: "Cutting-edge UI Library",
      icon: Code2,
      bgClass: "bg-white border-4 border-cyan-500",
      iconClass: "text-cyan-500",
    },
    {
      name: "Tailwind CSS",
      description: "Styling & Design System",
      icon: Heart,
      bgClass: "bg-white border-4 border-teal-500",
      iconClass: "text-teal-500",
    },
    {
      name: "Framer Motion",
      description: "Animations",
      icon: Rocket,
      bgClass: "bg-white border-4 border-purple-500",
      iconClass: "text-purple-500",
    },
  ];

  const stats = [
    {
      name: "Universities Partnered",
      value: "10+",
      icon: Building2,
      // Mission style (Light to Solid)
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
      icon: Rocket,
      colorClass:
        "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <AnimatedPageHeader>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                Empowering Student Life Through Events
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {isAuthenticated && user?.name ? `Welcome, ${user.name}! ` : ""}
                EventHub is dedicated to helping university students discover,
                book, and manage events seamlessly. We bridge the gap between
                campus life and professional opportunities.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Whether you are looking to join a hackathon, attend a workshop,
                or organize a club meeting, EventHub provides the tools and
                community you need to succeed. Join us in shaping the future of
                campus experiences.
              </p>
            </AnimatedPageHeader>
          </div>
        </div>
      </div>

      <AnimatedPageContent>
        {/* Stats Section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Impact by the Numbers
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Growing our community every day.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 bg-white rounded-[2rem] overflow-hidden group p-2">
                    <div className="h-full p-6 flex flex-col items-center text-center">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${stat.colorClass}`}
                      >
                        <stat.icon className="w-8 h-8" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-2 sm:text-4xl">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-slate-600">
                        {stat.name}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Our Mission
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Connecting Campus & Career
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              We believe in the power of community. Our platform is designed to
              make event management effortless for organizers and event
              discovery exciting for students.
            </p>
          </div>
        </div>

        {/* TechTalks Internship Section */}
        <div className="bg-slate-50 py-12 sm:py-16 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-10">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                Official Partnership
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                TechTalks Official Internship
              </p>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 px-6 py-12 shadow-2xl sm:px-12 md:pt-20 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0"
              >
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-500/30 via-transparent to-transparent" />
                <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left relative z-10">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Proudly Developed During
                    <br />
                    TechTalks Internship
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-indigo-100">
                    This project is a result of the intensive training and
                    mentorship provided by the TechTalks Official Internship
                    program, fostering the next generation of tech leaders.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                    <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm">
                      Certified Program
                    </div>
                  </div>
                </div>
                <div className="relative mt-16 h-80 lg:mt-8 flex items-center justify-center lg:justify-end">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="relative"
                  >
                    <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl" />
                    <GraduationCap className="relative h-64 w-64 text-white drop-shadow-2xl" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-10">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                The Minds Behind EventHub
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Meet the Team
              </p>
            </div>
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="w-full"
                  >
                    <div className="text-center group transition-all duration-300 hover:-translate-y-1 h-full bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
                      <div className="mb-4 inline-flex relative">
                        <div
                          className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${member.bgClass}`}
                        >
                          <member.icon
                            className={`w-12 h-12 transition-colors duration-300 ${member.iconClass}`}
                          />
                        </div>
                        <a
                          href={member.linkedinUrl}
                          className="absolute -bottom-2 -right-2 bg-[#0077b5] text-white p-2 rounded-lg shadow-lg hover:bg-[#006396] transition-colors duration-300 transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="text-xl font-bold text-slate-900 mb-1">
                        {member.name}
                      </div>
                      <div className="text-base font-medium text-slate-600 mb-2">
                        {member.role}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-10">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                Built With Modern Tech
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Our Technology Stack
              </p>
            </div>
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <div className="text-center group bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 hover:-translate-y-1 transition-all duration-300 h-full">
                      <div className="mb-4 inline-flex">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${tech.bgClass}`}
                        >
                          <tech.icon
                            className={`w-8 h-8 transition-colors duration-300 ${tech.iconClass}`}
                          />
                        </div>
                      </div>
                      <div className="text-lg font-bold text-slate-900 mb-2">
                        {tech.name}
                      </div>
                      <div className="text-sm text-slate-600 px-4">
                        {tech.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedPageContent>
    </div>
  );
}
