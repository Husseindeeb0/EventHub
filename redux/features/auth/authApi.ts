import { api } from "../../api";
import { AuthResponse, LoginCredentials, SignupData } from "@/types/auth";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    signup: builder.mutation<AuthResponse, SignupData>({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    checkSession: builder.query<AuthResponse, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    updateProfile: builder.mutation<
      AuthResponse,
      {
        name?: string;
        email?: string;
        description?: string;
        imageUrl?: string;
        imageFileId?: string;
        coverImageUrl?: string;
        coverImageFileId?: string;
      }
    >({
      query: (data) => ({
        url: "/auth/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    migrateEvents: builder.mutation<
      { success: boolean; message: string; migratedCount?: number },
      void
    >({
      query: () => ({
        url: "/user/migrate",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useCheckSessionQuery,
  useRefreshTokenMutation,
  useUpdateProfileMutation,
  useMigrateEventsMutation,
} = authApi;
