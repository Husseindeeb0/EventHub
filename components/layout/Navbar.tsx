"use client";

import Link from "next/link";
import { Menu, X, LogIn, User, LogOut, UserCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";

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
  { href: "/about", label: "About" },
  { href: "/bookings", label: "My Bookings", isProtected: true },
  // Organizer-specific links
  {
    href: "/myEvents",
    label: "My Events",
    isProtected: true,
    minRole: "organizer",
  },
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
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold text-white"
            >
              <img src="/logo.png" alt="EventHub Logo" className="w-40" />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                {link.label}
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
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="relative p-0 border-2 border-white/30 hover:border-white rounded-full transition duration-150 ease-in-out overflow-hidden h-11 w-11 flex items-center justify-center"
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-1 text-sm font-medium text-purple-600 bg-white hover:bg-gray-100 px-4 py-2 rounded-full transition duration-150 ease-in-out shadow-md"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              ))
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
      {isOpen && (
        <div
          className="md:hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-white/90 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Links */}
            {showLoadingState ? (
              <div className="pt-2 border-t border-white/20 flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : !isAuthenticated ? (
              <div className="pt-2 border-t border-white/20">
                {authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 text-white/90 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="pt-2 border-t border-white/20">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-white/90 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 w-full text-white/90 hover:bg-white/10 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
