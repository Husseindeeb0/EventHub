"use client";
import { useEffect, useState } from "react";
import {
  useCheckSessionQuery,
  useMigrateEventsMutation,
} from "@/redux/features/auth/authApi";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { stopLoading } from "@/redux/features/auth/authSlice";

export default function AuthInitializer() {
  const [shouldCheck, setShouldCheck] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isLoggedIn") === "true";
    }
    return false;
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!shouldCheck) {
      dispatch(stopLoading());
    }
  }, [shouldCheck, dispatch]);

  const { data: sessionData, isLoading: isSessionLoading } =
    useCheckSessionQuery(undefined, { skip: !shouldCheck });
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
