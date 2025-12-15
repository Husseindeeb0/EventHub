"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";

export function CTA() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  return (
    <section className="pt-40 pb-0 relative overflow-hidden">
      {/* Full Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center pb-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-10"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-tight">
            Ready to create your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              next masterpiece?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-indigo-100/80 max-w-2xl mx-auto font-light leading-relaxed">
            Join thousands of event organizers who are already using EventHub to
            create unforgettable experiences.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center">
            <Link href={isAuthenticated ? "/home" : "/signup"}>
              <Button
                size="lg"
                className="h-20 px-12 text-2xl rounded-full bg-white text-indigo-900 hover:bg-indigo-50 shadow-2xl shadow-indigo-900/50 hover:scale-105 transition-all duration-300 font-bold"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
