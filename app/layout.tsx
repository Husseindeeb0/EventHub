import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import StoreProvider from "@/redux/StoreProvider";

export const metadata: Metadata = {
  title: "EventHub - Discover and Manage Events",
  description: "Discover and book events happening around you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="">
        <StoreProvider>
          <Navbar />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
