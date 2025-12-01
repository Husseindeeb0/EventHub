"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/" || pathname === "";
        }
        return pathname?.startsWith(path);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-purple-100/50 bg-gradient-to-r from-white via-purple-50/30 to-blue-50/30 backdrop-blur-md shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40">
                            Login / Sign Up
                        </Link>
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all group-hover:scale-105">
                                E
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">EventHub</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                isActive("/") && !isActive("/myEvents") && !isActive("/profile")
                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                                    : "text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                            }`}
                        >
                            Events
                        </Link>
                        <Link
                            href="/myEvents"
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                isActive("/myEvents")
                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                                    : "text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                            }`}
                        >
                            My Events
                        </Link>
                        <Link
                            href="/profile"
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                isActive("/profile")
                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                                    : "text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                            }`}
                        >
                            Profile
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

