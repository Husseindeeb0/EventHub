"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

// Declare vanta types
declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

interface VantaBackgroundProps {
  className?: string;
}

export default function VantaBackground({
  className = "",
}: VantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if dark mode is active (accounting for 'system' preference)
  // This logic is now safe because we only use it after 'mounted' is true
  const isDark =
    mounted &&
    (theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches));

  useEffect(() => {
    if (!mounted) return;

    const loadVanta = async () => {
      if (typeof window === "undefined") return;

      if (!window.THREE) {
        const THREE = await import("three");
        window.THREE = THREE;
      }

      const vantaModule = await import("vanta/dist/vanta.globe.min");

      // Define colors based on theme
      const config = isDark
        ? {
            color: 0x6366f1, // indigo-500
            color2: 0xa855f7, // purple-500
            backgroundColor: 0x0f0c1a, // Very dark purple/black
          }
        : {
            color: 0x7c3aed, // violet-600
            color2: 0x6366f1, // indigo-500
            backgroundColor: 0xffffff, // pure white
          };

      if (vantaRef.current) {
        if (!vantaEffect) {
          const effectInstance = vantaModule.default({
            el: vantaRef.current,
            THREE: window.THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            size: 0.6,
            ...config,
          });
          setVantaEffect(effectInstance);
        } else {
          vantaEffect.setOptions(config);
        }
      }
    };

    loadVanta();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark, mounted]);

  useEffect(() => {
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  // Return a simple div on server/initial render to avoid mismatch
  // The background gradient will be set via style prop only after mount to match the theme
  // OR set a safe default.
  // To strictly fix hydration mismatch, we render the structure but avoid different attributes.
  // However, for the background color/gradient which changes significantly,
  // it's best to rely on CSS classes or render nothing until mounted if acceptable,
  // OR use a neutral default that doesn't cause a jarring shift if possible.
  // Given the user wants "professional and elegant", a flash of white might be bad if dark mode.
  // But a hydration mismatch error is worse.
  // Let's use the `mounted` check to render the specific background style.

  if (!mounted) {
    return <div className={`fixed inset-0 -z-50 ${className}`} />;
  }

  return (
    <div
      ref={vantaRef}
      className={`fixed inset-0 -z-50 transition-colors duration-700 ease-in-out ${className}`}
      style={{
        backgroundColor: isDark ? "#0f0c1a" : "#ffffff",
      }}
    />
  );
}
