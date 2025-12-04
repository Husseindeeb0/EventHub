"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"

export function Navbar() {
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = React.useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20)
    })

    return (
        <motion.nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300",
                isScrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
                    : "bg-transparent"
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-2">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-lg font-bold">E</span>
                    EventHub
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/5">
                    Login
                </Button>
                <Button className="text-base font-medium px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                    Sign Up
                </Button>
            </div>
        </motion.nav>
    )
}
