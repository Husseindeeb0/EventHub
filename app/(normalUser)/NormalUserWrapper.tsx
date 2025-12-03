"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NormalUserWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
