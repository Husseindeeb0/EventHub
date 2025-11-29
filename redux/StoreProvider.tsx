"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";

/**
 * Redux Store Provider Component
 *
 * Wraps the application with Redux Provider to make the store
 * available to all components
 *
 * Must be a Client Component (uses 'use client' directive) because
 * Redux requires client-side JavaScript
 *
 * Usage:
 * Wrap your app layout or specific sections that need Redux access
 *
 * @param children - Child components that will have access to Redux store
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
