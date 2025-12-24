"use client";
import { useEffect } from "react";
import {
  useCheckSessionQuery,
  useMigrateEventsMutation,
} from "@/redux/features/auth/authApi";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { stopLoading } from "@/redux/features/auth/authSlice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.auth
  );

  // Check session on mount if we haven't already
  // We don't skip this anymore based on localStorage because it can be inconsistent
  const {
    isLoading: isSessionLoading,
    isError,
    isSuccess,
  } = useCheckSessionQuery(undefined, {
    // If we're already authenticated from a previous action (like login), we can skip
    skip: isAuthenticated,
  });

  // Handle errors or success to stop global loading state
  useEffect(() => {
    if (isError || isSuccess) {
      dispatch(stopLoading());
    }
  }, [isError, isSuccess, dispatch]);

  // Migration logic
  const [migrateEvents, { isLoading: isMigrating, isUninitialized }] =
    useMigrateEventsMutation();

  useEffect(() => {
    // Only run if authenticated, session is loaded, and we haven't started migrating yet
    if (
      isAuthenticated &&
      !isSessionLoading &&
      isUninitialized &&
      !isMigrating
    ) {
      migrateEvents()
        .unwrap()
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
