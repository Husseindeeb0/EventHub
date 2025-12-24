"use client";

import Link from "next/link";
import {
  Menu,
  X,
  LogIn,
  User,
  LogOut,
  UserCircle,
  MessageSquare,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import NotificationsDropdown from "./NotificationsDropdown";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type UserRole = "user" | "organizer" | null;

interface NavLink {
  href: string;
  label: string;
  isProtected?: boolean;
  minRole?: UserRole;
}

// --- Navigation Links Data ---
const navLinks: NavLink[] = [
  { href: "/home", label: "Home" },
  { href: "/organizers", label: "Organizers" },
  { href: "/about", label: "About" },
  { href: "/bookings", label: "Bookings", isProtected: true },
];

const authLinks = [
  { href: "/login", label: "Log In", icon: LogIn },
  { href: "/signup", label: "Sign Up", icon: User },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [logout] = useLogoutMutation();
  const router = useRouter();

  // --- Redux State ---
  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.auth
  );
  const userRole: UserRole = user?.role || null;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if we expect the user to be logged in (from localStorage)
  // This helps prevent "flash of unauthenticated content"
  const isLoggedInLocally =
    typeof window !== "undefined"
      ? localStorage.getItem("isLoggedIn") === "true"
      : false;

  const showLoadingState = loading || (isLoggedInLocally && !isAuthenticated);

  const filteredLinks = navLinks.filter((link) => {
    // If not authenticated (or still loading), only show public links
    if (!isAuthenticated) {
      return !link.isProtected && !link.minRole;
    }

    // If authenticated, filter by role
    if (link.minRole && userRole !== link.minRole) {
      return false;
    }
    return true;
  });

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout().unwrap();
    localStorage.removeItem("isLoggedIn");
    setShowProfileMenu(false);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-r from-indigo-700/90 via-purple-700/80 to-blue-700/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <div className="shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold text-white transition-all duration-300"
            >
              <img src="/logo.png" alt="EventHub Logo" className="w-40" />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-5 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-white/70 hover:text-white transition-all duration-500 group"
              >
                <span className="relative z-10">{link.label}</span>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm group-hover:blur-0" />
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100" />
              </Link>
            ))}
          </div>

          {/* Auth & Profile Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {showLoadingState ? (
              // Loading State (Spinner or empty w/ same height)
              <div className="h-11 w-11 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <NotificationsDropdown />
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="relative p-0 border-2 border-white/30 hover:border-white rounded-full transition duration-150 ease-in-out overflow-hidden h-11 w-11 flex items-center justify-center cursor-pointer"
                    title="Profile"
                  >
                    {user?.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.imageUrl}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-slate-100 ring-1 ring-black/5 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 bg-slate-50/50">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate font-medium">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <UserCircle className="h-4 w-4 mr-3 text-indigo-500" />
                          Profile
                        </Link>
                        {userRole === "organizer" && (
                          <Link
                            href="/myEvents"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 mr-3 text-indigo-500" />
                            Organizer Hub
                          </Link>
                        )}
                        <Link
                          href="/feedback"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4 mr-3 text-indigo-500" />
                          Feedback
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center space-x-2 text-[11px] font-black uppercase tracking-widest text-indigo-600 bg-white hover:bg-slate-50 px-6 py-2.5 rounded-full transition-all duration-500 shadow-lg shadow-indigo-500/20 active:scale-95 border border-transparent hover:border-indigo-100"
                >
                  <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-500" />
                  <span>{link.label}</span>
                </Link>
              ))
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && <NotificationsDropdown />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              opacity: { duration: 0.2 },
            }}
            className="md:hidden bg-linear-to-b from-indigo-800 to-indigo-900 border-t border-white/5 shadow-2xl overflow-hidden"
            id="mobile-menu"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="px-4 pt-4 pb-8 space-y-2"
            >
              {filteredLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 * index }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-white/70 hover:bg-white/10 hover:text-white px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Auth Links */}
              {showLoadingState ? (
                <div className="pt-4 border-t border-white/10 flex justify-center py-6">
                  <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : !isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                  className="pt-4 mt-4 border-t border-white/10 space-y-3"
                >
                  {authLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 + 0.05 * index }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 text-white/90 bg-white/5 hover:bg-white/10 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300"
                      >
                        <link.icon className="h-5 w-5 text-indigo-400" />
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                  className="pt-4 mt-4 border-t border-white/10 space-y-2"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 text-white/70 hover:bg-white/10 hover:text-white px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300"
                    >
                      <UserCircle className="h-5 w-5 text-indigo-400" />
                      <span>Profile</span>
                    </Link>
                  </motion.div>
                  {userRole === "organizer" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.22 }}
                    >
                      <Link
                        href="/myEvents"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 text-white/70 hover:bg-white/10 hover:text-white px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300"
                      >
                        <LayoutDashboard className="h-5 w-5 text-indigo-400" />
                        <span>Organizer Hub</span>
                      </Link>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                  >
                    <Link
                      href="/feedback"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 text-white/70 hover:bg-white/10 hover:text-white px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300"
                    >
                      <MessageSquare className="h-5 w-5 text-indigo-400" />
                      <span>Feedback</span>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center space-x-3 w-full text-red-300 hover:bg-red-500/10 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
