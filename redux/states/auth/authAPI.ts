import axios, { AxiosInstance } from "axios";
import { LoginCredentials, SignupData, AuthResponse } from "@/types/auth";

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: "/api/auth", // Base URL for all auth endpoints
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/login", credentials);
  return response.data;
};

export const logoutUser = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/logout");
  return response.data;
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/refresh");
  return response.data;
};

export default apiClient;
