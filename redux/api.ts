import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base API slice with empty endpoints
// This allows other features to inject their own endpoints using split entries
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      // Global header configuration can go here
      return headers;
    },
  }),
  tagTypes: ["User", "Event"], // Global tag types
  endpoints: () => ({}), // Empty endpoints, to be injected by features
});
