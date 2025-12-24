"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  X,
  ChevronDown,
} from "lucide-react";
import {
  useGetEventsQuery,
  useGetCategoriesQuery,
} from "@/redux/features/events/eventsApi";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_CATEGORIES } from "@/lib/utils";

interface EventSearchBarProps {
  onSearch: (filters: {
    search: string;
    category: string;
    status: "active" | "finished" | "";
  }) => void;
}

const EventSearchBar: React.FC<EventSearchBarProps> = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState<"active" | "finished" | "">("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch all unique categories from the database
  const { data: catData } = useGetCategoriesQuery();
  const dynamicCategories = catData?.categories || [];

  // Combine default categories with those found in the database
  const ALL_CATEGORIES = Array.from(
    new Set(["All", ...DEFAULT_CATEGORIES, ...dynamicCategories])
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({ search, category, status });
    }, 400);
    return () => clearTimeout(timer);
  }, [search, category, status, onSearch]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setStatus("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12 px-4">
      <div className="relative group">
        {/* Main Search Input */}
        <div className="relative z-20 flex items-center bg-white/80 backdrop-blur-xl border-2 border-slate-100 rounded-3xl shadow-2xl shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-500 overflow-hidden">
          <div className="pl-6 text-indigo-500">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            placeholder="Search by event name..."
            className="flex-1 px-4 py-6 text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex items-center gap-2 pr-4">
            {search && (
              <button
                onClick={() => setSearch("")}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="w-[2px] h-8 bg-slate-100 mx-2" />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 ${
                isExpanded
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDown
                className={`hidden sm:block w-4 h-4 transition-transform duration-500 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Expanded Filters Pane */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="relative z-10 -mt-6 pt-12 pb-8 px-8 bg-slate-50/80 backdrop-blur-xl border-2 border-t-0 border-slate-100 rounded-b-[40px] shadow-xl overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Categories */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1">
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {ALL_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                          category === cat
                            ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md shadow-indigo-200"
                            : "bg-white text-slate-600 border-slate-100 hover:border-indigo-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Toggle */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1">
                    Event Status
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "", label: "All", icon: Calendar },
                      { id: "active", label: "Active", icon: Clock },
                      { id: "finished", label: "Finished", icon: CheckCircle2 },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setStatus(item.id as any)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 group ${
                          status === item.id
                            ? "bg-white border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-100"
                            : "bg-white border-slate-100 text-slate-400 hover:border-indigo-100 hover:text-slate-600"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 mb-2 transition-transform duration-500 ${
                            status === item.id
                              ? "scale-110"
                              : "group-hover:scale-110"
                          }`}
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset Footer */}
              <div className="mt-10 pt-6 border-t border-slate-200/50 flex justify-between items-center">
                <p className="text-xs font-medium text-slate-400">
                  Refining{" "}
                  {category !== "All" || status !== "" ? "filtered" : "all"}{" "}
                  experiences
                </p>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Category Bar (Visible even when collapsed) */}
      {!isExpanded && (
        <div className="mt-8 flex justify-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          {ALL_CATEGORIES.slice(0, 8).map(
            (cat) =>
              cat !== "All" && (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === category ? "All" : cat)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap shadow-sm border-2 ${
                    category === cat
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-100"
                      : "bg-white/50 backdrop-blur-md text-slate-400 border-white hover:border-indigo-100 hover:text-indigo-500"
                  }`}
                >
                  #{cat}
                </button>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default EventSearchBar;
