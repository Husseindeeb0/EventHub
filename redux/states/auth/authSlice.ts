import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/types/auth";

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /*
     * Set the authenticated user
     * Called after successful login or when restoring session
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    /**
     * Clear user data and authentication status
     * Called during logout or when session expires
     */
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    /**
     * Set loading state
     * Used to show loading indicators during async operations
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Set error message
     * Called when authentication operations fail
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    /**
     * Clear error message
     * Used to reset error state
     */
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const { setUser, clearUser, setLoading, setError, clearError } =
  authSlice.actions;

// Export reducer
export default authSlice.reducer;
