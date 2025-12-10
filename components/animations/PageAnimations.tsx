"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedPageHeaderProps {
    children: ReactNode;
}

export function AnimatedPageHeader({ children }: AnimatedPageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedPageContent({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedCard({ 
    children, 
    delay = 0 
}: { 
    children: ReactNode; 
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
                duration: 0.5, 
                delay,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedGrid({ 
    children 
}: { 
    children: ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
        >
            {children}
        </motion.div>
    );
}


