"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { setUser, setLoading } from "@/redux/states/auth/authSlice";
import axios from "axios";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get("/api/auth/me");

        if (response.data.success && response.data.user) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        // User is not authenticated, do nothing
        console.log("No active session");
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  return null;
}
