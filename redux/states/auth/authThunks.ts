import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginCredentials, SignupData } from "@/types/auth";
import { signupUser, loginUser, logoutUser, refreshToken } from "./authAPI";
import { setUser, clearUser, setLoading, setError } from "./authSlice";

/**
 * Authentication Async Thunks
 *
 * Handles asynchronous authentication operations
 * Each thunk dispatches appropriate actions to update the Redux state
 *
 * Thunks automatically handle:
 * - Loading states
 * - Error handling
 * - Success/failure state updates
 */

/**
 * Signup Thunk
 * Registers a new user and handles the response
 *
 * @param data - Signup form data
 * @returns Promise with signup result
 */
export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (data: SignupData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await signupUser(data);

      if (response.success) {
        dispatch(setLoading(false));
        return response;
      } else {
        dispatch(setError(response.message));
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Login Thunk
 * Authenticates user and stores user data in Redux state
 * Cookies are automatically set by the backend
 *
 * @param credentials - Login credentials (email and password)
 * @returns Promise with login result
 */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await loginUser(credentials);

      if (response.success && response.user) {
        // Store user data in Redux state
        dispatch(setUser(response.user));
        return response;
      } else {
        dispatch(setError(response.message));
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Logout Thunk
 * Logs out user and clears authentication state
 *
 * @returns Promise with logout result
 */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await logoutUser();

      if (response.success) {
        // Clear user data from Redux state
        dispatch(clearUser());
        return response;
      } else {
        dispatch(setError(response.message));
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Logout failed. Please try again.";
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

/**
 * Refresh Token Thunk
 * Silently refreshes the access token using the refresh token
 * This is typically called when an API request fails with 401 Unauthorized
 *
 * @returns Promise with refresh result
 */
export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshToken();

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Token refresh failed";
      return rejectWithValue(errorMessage);
    }
  }
);
