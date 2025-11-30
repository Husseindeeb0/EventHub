// app/layout.tsx (CORRECTED CODE)

import type { Metadata } from "next";
import "./globals.css"; // Ensure global styles (Tailwind) are imported

// 👇 1. IMPORT YOUR COMPONENTS (Check the path carefully!)
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';


export const metadata: Metadata = {
  title: "EventHub Platform",
  description: "Event booking and management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        {/* Container to ensure the footer is pushed to the bottom */}
        <div className="flex flex-col min-h-screen">

          {/* ⭐️ 2. RENDER THE NAVBAR ⭐️ */}
          <Navbar />

          {/* ⭐️ 3. RENDER THE PAGE CONTENT */}
          <main className="flex-grow">
            {children}
          </main>

          {/* ⭐️ 4. RENDER THE FOOTER ⭐️ */}
          <Footer />

        </div>
      </body>
    </html>
  );
}