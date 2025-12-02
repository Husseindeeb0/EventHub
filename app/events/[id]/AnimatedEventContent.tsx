"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedEventContentProps {
    children: ReactNode;
}

export function AnimatedHero({ children }: AnimatedEventContentProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedContent({ children }: AnimatedEventContentProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedCard({ children, delay = 0 }: AnimatedEventContentProps & { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedSuccessMessage({ children }: AnimatedEventContentProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}




