import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";

export const metadata: Metadata = {
  title: "EventHub - Event Booking Platform",
  description: "Book and manage events with EventHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
