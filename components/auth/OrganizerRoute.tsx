"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";

interface OrganizerRouteProps {
  children: React.ReactNode;
}

export default function OrganizerRoute({ children }: OrganizerRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.auth
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth initialization to complete
    if (!loading) {
      setIsChecking(false);

      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "organizer") {
        // User is authenticated but not an organizer
        router.push("/");
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loading state while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if not authenticated or not an organizer
  if (!isAuthenticated || user?.role !== "organizer") {
    return null;
  }

  return <>{children}</>;
}
