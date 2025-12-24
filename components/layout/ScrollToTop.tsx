"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Standard window scroll reset
    window.scrollTo(0, 0);

    // Also reset any potential overflow containers if they exist
    // Useful if the standard window scroll is blocked by layout styles
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
