"use client";

import { AnimatedGrid as AnimatedGridWrapper } from "./PageAnimations";

export default function AnimatedGrid({ children }: { children: React.ReactNode }) {
    return <AnimatedGridWrapper>{children}</AnimatedGridWrapper>;
}

