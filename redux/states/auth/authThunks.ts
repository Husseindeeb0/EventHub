import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginCredentials, SignupData } from "@/types/auth";
import { signupUser, loginUser, logoutUser, refreshToken } from "./authAPI";
import { setUser, clearUser, setLoading, setError } from "./authSlice";

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
