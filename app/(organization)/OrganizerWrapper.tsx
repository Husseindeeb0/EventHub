"use client";

import OrganizerRoute from "@/components/auth/OrganizerRoute";

export default function OrganizerClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrganizerRoute>{children}</OrganizerRoute>;
}
