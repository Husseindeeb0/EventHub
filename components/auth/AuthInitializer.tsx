"use client";
import { useEffect } from "react";
import {
  useCheckSessionQuery,
  useMigrateEventsMutation,
} from "@/redux/features/auth/authApi";
import { useAppSelector } from "@/redux/store";

export default function AuthInitializer() {
  const { data: sessionData, isLoading: isSessionLoading } =
    useCheckSessionQuery();
  const [migrateEvents, { isLoading: isMigrating, isUninitialized }] =
    useMigrateEventsMutation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only run if authenticated, session is loaded, and we haven't started migrating yet
    if (
      isAuthenticated &&
      !isSessionLoading &&
      isUninitialized &&
      !isMigrating
    ) {
      console.log("[AuthInitializer] Initial migration check...");

      migrateEvents()
        .unwrap()
        .then((res) => {
          console.log("[AuthInitializer] Migration process finished:", res);
        })
        .catch((err) => {
          console.error("[AuthInitializer] Migration API error:", err);
        });
    }
  }, [
    isAuthenticated,
    isSessionLoading,
    isUninitialized,
    isMigrating,
    migrateEvents,
  ]);

  return null;
}
