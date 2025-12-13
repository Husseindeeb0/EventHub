"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const missions = [
  {
    title: "Connect People",
    description:
      "Bringing communities together through shared experiences and memorable moments.",
    icon: Users,
  },
  {
    title: "Simplify Hosting",
    description:
      "Powerful tools for organizers to manage events without the headache.",
    icon: Calendar,
  },
  {
    title: "Instant Access",
    description:
      "Seamless booking and ticketing for attendees, anytime, anywhere.",
    icon: Zap,
  },
];

export function Mission() {
  return (
    <section className="py-32 bg-slate-50/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
            Our Mission
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            We are dedicated to making event discovery and management as
            effortless as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {missions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 bg-white rounded-[2rem] overflow-hidden group p-2">
                <div className="h-full p-6 flex flex-col items-start">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${
                      index === 0
                        ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                        : index === 1
                        ? "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
                        : "bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white"
                    }`}
                  >
                    <item.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold mb-3 text-gray-900">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-lg leading-relaxed text-muted-foreground/80 font-light">
                    {item.description}
                  </CardDescription>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
