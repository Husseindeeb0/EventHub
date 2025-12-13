"use client";

import { useCheckSessionQuery } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/store";

export default function AuthInitializer() {
  // Automatically triggers the query on mount
  useCheckSessionQuery();

  return null;
}
