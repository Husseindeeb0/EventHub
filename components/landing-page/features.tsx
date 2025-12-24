"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Ticket,
  PlusCircle,
  Bot,
  MessageCircle,
  Star,
  UserPlus,
  Bell,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Browse Events",
    description:
      "Discover and explore a wide variety of events happening around you.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Ticket,
    title: "Easy Booking",
    description:
      "Book tickets seamlessly with a simple and intuitive interface.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: PlusCircle,
    title: "Create Events",
    description: "Organizers can easily create and publish their own events.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      "Get instant help from our smart AI bot for any questions about events.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: MessageCircle,
    title: "Event Discussions",
    description:
      "Connect with fellow attendees before the event through discussion chats.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Star,
    title: "Rate Events",
    description: "Share your experience by rating events you've attended.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: UserPlus,
    title: "Follow Organizers",
    description:
      "Stay connected with your favorite organizers and never miss their events.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get notified about new events from organizers you follow.",
    gradient: "from-red-500 to-pink-500",
  },
];

export function Features() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Powerful features designed to make event management effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="h-full border-none shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 bg-white rounded-2xl p-6 group">
                <CardContent className="p-0 space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
