// components/layout/Footer.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, X, Mail, Phone, Copyright } from "lucide-react";

// Navigation links matching the navbar
const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "My Bookings", href: "/bookings" },
];

const contact = [
  { icon: Mail, text: "support@eventhub.com", type: "email" },
  { icon: Phone, text: "+1 (555) 123-4567", type: "phone" },
];

const social = [
  { icon: Facebook, href: "https://facebook.com/eventhub", label: "Facebook" },
  {
    icon: Instagram,
    href: "https://instagram.com/eventhub",
    label: "Instagram",
  },
  { icon: X, href: "https://x.com/eventhub", label: "X" },
];

const legal = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 border-t border-purple-700/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Main 3-column layout for large screens, stacked for mobile */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 xl:gap-12">
          {/* Section 1: Logo and Mission */}
          <div className="space-y-6 lg:col-span-1 mb-8 lg:mb-0">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Event<span className="text-purple-300">Hub</span>
            </h3>
            <p className="text-gray-300 text-sm max-w-xs">
              Your one-stop platform for finding and booking the best events.
              Never miss out on what's happening.
            </p>
            <div className="flex space-x-4 pt-2">
              {social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-purple-300 transition-colors"
                  aria-label={item.label}
                >
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Section 2, 3, & 4 container */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 md:grid-cols-3">
            {/* Quick Links */}
            <div className="space-y-4 col-span-2 md:col-span-1">
              <h4 className="text-md font-semibold text-white">Quick Links</h4>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-300 hover:text-purple-300 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 md:col-span-1">
              <h4 className="text-md font-semibold text-white">Contact Us</h4>
              <ul className="space-y-3">
                {contact.map((item, index) => {
                  let link: string | undefined;
                  if (item.type === "email") {
                    link = `mailto:${item.text}`;
                  } else if (item.type === "phone") {
                    link = `tel:${item.text.replace(/[^0-9+]/g, "")}`;
                  }

                  return (
                    <li key={index} className="flex items-start">
                      <item.icon
                        className="h-5 w-5 text-purple-300 mr-2 shrink-0"
                        aria-hidden="true"
                      />
                      {link ? (
                        <a
                          href={link}
                          className="text-sm text-gray-300 hover:text-purple-300 transition-colors"
                          aria-label={
                            item.type === "email"
                              ? `Email us at ${item.text}`
                              : `Call us at ${item.text}`
                          }
                        >
                          {item.text}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-300">
                          {item.text}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4 mt-8 col-span-2 md:col-span-1 md:mt-0">
              <h4 className="text-md font-semibold text-white">Legal</h4>
              <ul className="space-y-3">
                {legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-300 hover:text-purple-300 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-8 border-t border-purple-700/50 pt-4">
          <p className="text-sm text-gray-300 flex items-center justify-center">
            <Copyright className="h-4 w-4 mr-1" aria-hidden="true" />
            {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
