"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  if (!mounted) {
    return (
      <button
        className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 overflow-hidden cursor-pointer"
        aria-label="Toggle theme"
      >
        <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
          <Sun className="h-4 w-4 text-yellow-500 z-10" />
          <Moon className="h-4 w-4 text-indigo-200 z-10" />
        </div>
        <div className="absolute top-1 left-1 bg-white dark:bg-slate-900 w-6 h-6 rounded-full shadow-md z-20" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 overflow-hidden cursor-pointer"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Sun className="h-4 w-4 text-yellow-500 z-10" />
        <Moon className="h-4 w-4 text-indigo-200 z-10" />
      </div>

      <div
        className={`absolute top-1 left-1 bg-white dark:bg-slate-900 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out z-20 flex items-center justify-center ${
          theme === "dark" ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="h-3 w-3 text-indigo-400" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500" />
        )}
      </div>
    </button>
  );
}
