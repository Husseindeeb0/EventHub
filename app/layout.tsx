// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";

// 1. FIX: Use default imports (no curly braces)
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StoreProvider from "@/redux/StoreProvider";
import AuthInitializer from "@/components/auth/AuthInitializer";

// Define Metadata as needed
export const metadata: Metadata = {
  title: "EventHub",
  description: "Your platform for events.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AuthInitializer />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
