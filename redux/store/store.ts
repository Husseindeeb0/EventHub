import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../states/auth/authSlice";

/**
 * Redux Store Configuration
 *
 * Combines all reducers and configures the Redux store
 * Currently includes only the auth reducer, but can be extended
 * with additional reducers as the application grows
 *
 * The store is configured with Redux Toolkit's default middleware
 * which includes redux-thunk for async operations
 */

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here as the application grows
    // Example: events: eventsReducer, bookings: bookingsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        // This is useful if you need to pass non-serializable values
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Typed hooks for use throughout the application
 * These hooks provide type safety when accessing state and dispatching actions
 */
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
