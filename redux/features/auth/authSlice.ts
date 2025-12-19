import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "@/types/auth";
import { authApi } from "./authApi";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = payload.user || null;
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, { payload, error }) => {
          state.loading = false;
          state.isAuthenticated = false;
          state.error =
            (payload as any)?.message || error.message || "Login failed";
        }
      )
      // Signup
      .addMatcher(authApi.endpoints.signup.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.signup.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = payload.user || null;
        }
      )
      .addMatcher(
        authApi.endpoints.signup.matchRejected,
        (state, { payload, error }) => {
          state.loading = false;
          state.isAuthenticated = false;
          state.error =
            (payload as any)?.message || error.message || "Signup failed";
        }
      )
      // Logout
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // Check Session
      .addMatcher(authApi.endpoints.checkSession.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.checkSession.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = payload.user || null;
        }
      )
      .addMatcher(authApi.endpoints.checkSession.matchRejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Update Profile
      .addMatcher(authApi.endpoints.updateProfile.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.updateProfile.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.user = payload.user || state.user;
        }
      )
      .addMatcher(
        authApi.endpoints.updateProfile.matchRejected,
        (state, { payload, error }) => {
          state.loading = false;
          state.error =
            (payload as any)?.message || error.message || "Update profile failed";
        }
      );
  },
});

export const { logout } = authSlice.actions;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
