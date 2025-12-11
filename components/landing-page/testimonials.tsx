"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "EventHub transformed how we manage our annual tech conference. The analytics alone saved us countless hours of manual tracking.",
    author: "Sarah Chen",
    role: "Event Director",
    company: "TechSummit Global",
    avatar: "SC",
  },
  {
    quote:
      "We've hosted over 200 community meetups using EventHub. The platform is intuitive, reliable, and our attendees love the seamless experience.",
    author: "Marcus Johnson",
    role: "Community Manager",
    company: "DevConnect",
    avatar: "MJ",
  },
  {
    quote:
      "The custom branding features let us maintain our identity while leveraging EventHub's powerful infrastructure. It's the best of both worlds.",
    author: "Emily Rodriguez",
    role: "Marketing Lead",
    company: "Creative Workshops Inc",
    avatar: "ER",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 bg-slate-50/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
            Loved by Event Organizers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            See what our customers have to say about their experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 bg-white rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <Quote className="w-10 h-10 text-indigo-200" />

                  <p className="text-lg text-gray-700 leading-relaxed font-light italic">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
