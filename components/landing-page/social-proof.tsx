"use client"

import { motion } from "framer-motion"

// Placeholder company names - in production, these would be actual logos
const companies = [
    "TechCorp", "InnovateLabs", "GlobalEvents", "StartupHub",
    "CreativeStudio", "MeetupPro", "ConferenceX", "EventFlow",
    "GatherSpace", "NetworkPlus", "SummitCo", "ConnectHub"
]

export function SocialProof() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-3">
                        Trusted by Leading Organizations
                    </h2>
                    <p className="text-muted-foreground font-light">
                        Join thousands of companies using EventHub
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                    {companies.map((company, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="flex items-center justify-center"
                        >
                            <div className="group cursor-pointer">
                                <div className="px-6 py-4 rounded-xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-indigo-100 transition-all duration-300 hover:shadow-md">
                                    <div className="text-center font-bold text-gray-400 group-hover:text-indigo-600 transition-colors duration-300 text-sm md:text-base">
                                        {company}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
