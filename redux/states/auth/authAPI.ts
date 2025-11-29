import axios, { AxiosInstance } from "axios";
import { LoginCredentials, SignupData, AuthResponse } from "@/types/auth";

/**
 * Authentication API Layer
 *
 * Centralized API calls for authentication operations
 * Uses Axios with credentials enabled for cookie handling
 *
 * All functions return promises that resolve to AuthResponse
 */

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: "/api/auth", // Base URL for all auth endpoints
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Register a new user
 *
 * @param data - Signup form data
 * @returns Promise resolving to authentication response
 */
export const signupUser = async (data: SignupData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/signup", {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    description: data.description,
  });
  return response.data;
};

/**
 * Authenticate a user
 * Sets access and refresh tokens as HTTP-only cookies
 *
 * @param credentials - Login credentials (email and password)
 * @returns Promise resolving to authentication response with user data
 */
export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/login", credentials);
  return response.data;
};

/**
 * Log out the current user
 * Clears authentication cookies and revokes refresh token
 *
 * @returns Promise resolving to authentication response
 */
export const logoutUser = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/logout");
  return response.data;
};

/**
 * Refresh the access token
 * Uses refresh token from cookies to obtain a new access token
 *
 * @returns Promise resolving to authentication response
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/refresh");
  return response.data;
};

export default apiClient;
