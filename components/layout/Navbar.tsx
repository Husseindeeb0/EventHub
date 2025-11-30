'use client';

import Link from 'next/link';
import { Menu, X, ChevronDown, LogIn, User, Plus } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

// --- Types (Simplified for this component) ---
// In a real Redux setup, this would come from the store.
type UserRole = 'NormalUser' | 'Organizer' | null;

interface NavLink {
    href: string;
    label: string;
    isProtected?: boolean;
    minRole?: UserRole;
}

// --- Navigation Links Data ---
const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/bookings', label: 'Bookings', isProtected: true },
    { href: '/profile', label: 'Profile', isProtected: true },
    // Organizer-specific links
    { href: '/create-event', label: 'Create Event', isProtected: true, minRole: 'Organizer' },
    { href: '/my-events', label: 'My Events', isProtected: true, minRole: 'Organizer' },
];

const authLinks = [
    { href: '/login', label: 'Log In', icon: LogIn },
    { href: '/signup', label: 'Sign Up', icon: User },
];


export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // --- MOCK STATE (Will be replaced by Redux in the final app) ---
    // The 'Authentication' module team member will integrate the real Redux state.
    const isAuthenticated = true; // Replace with Redux selector
    const userRole: UserRole = 'Organizer'; // Replace with Redux selector

    const filteredLinks = navLinks.filter(link => {
        if (!link.isProtected) return true; // Always show public links
        if (isAuthenticated) {
            if (link.minRole === 'Organizer' && userRole === 'Organizer') {
                return true;
            }
            // Show protected links for any authenticated user if no specific role is required
            if (!link.minRole) {
                return true;
            }
        }
        return false;
    });
    // -----------------------------------------------------------------

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-indigo-600">
                            {/*  */}
                            <span className="text-2xl font-extrabold tracking-tight">EventHub</span>
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {filteredLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth & Profile Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <Link
                                href="/profile"
                                className="p-2 border-2 border-transparent hover:border-indigo-600 rounded-full transition duration-150 ease-in-out"
                                title="Profile"
                            >
                                <User className="h-6 w-6 text-gray-700" />
                            </Link>
                        ) : (
                            authLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center space-x-1 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-full transition duration-150 ease-in-out"
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
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {filteredLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile Auth Links */}
                        {!isAuthenticated && (
                            <div className="pt-2 border-t border-gray-100">
                                {authLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center space-x-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        <link.icon className="h-5 w-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;