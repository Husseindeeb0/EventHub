"use client"

import { motion } from "framer-motion"
import { Users, Calendar, Globe, Zap } from "lucide-react"

const stats = [
    {
        icon: Calendar,
        value: "50K+",
        label: "Events Hosted",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: Users,
        value: "1M+",
        label: "Tickets Sold",
        color: "from-purple-500 to-pink-500"
    },
    {
        icon: Globe,
        value: "150+",
        label: "Countries",
        color: "from-indigo-500 to-purple-500"
    },
    {
        icon: Zap,
        value: "99.9%",
        label: "Uptime",
        color: "from-orange-500 to-red-500"
    }
]

export function Stats() {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white" />

            <div className="container mx-auto px-4 md:px-6 relative">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className="mb-4 inline-flex">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                                    <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                                        <stat.icon className={`w-8 h-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
