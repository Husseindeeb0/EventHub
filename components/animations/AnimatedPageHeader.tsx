"use client";

import { AnimatedPageHeader as AnimatedHeader } from "./PageAnimations";

export default function AnimatedPageHeader({ children }: { children: React.ReactNode }) {
    return <AnimatedHeader>{children}</AnimatedHeader>;
}
