import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import authReducer from "./features/auth/authSlice";
import eventsReducer from "./features/events/eventsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
