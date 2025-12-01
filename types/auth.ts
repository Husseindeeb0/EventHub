export interface BookingDetails {
  userId: string;
  userName: string;
  userEmail: string;
  seatsBooked: number;
  bookedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "organizer";
  description?: string;
  bookedEvents: string[];
  attendedEvents: string[];
  createdEvents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "organizer";
  description?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}
