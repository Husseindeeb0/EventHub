/**
 * TypeScript Type Definitions for Authentication
 * Shared interfaces used across the authentication module
 *
 * Note: Booking-related types are imported from Event model
 * to maintain single source of truth
 */

/**
 * Booking details for an event (used in organizer's myEvents)
 * Imported from Event model - do not duplicate
 */
export interface BookingDetails {
  userId: string;
  userName: string;
  userEmail: string;
  seatsBooked: number;
  bookedAt: string;
}

/**
 * Organizer event with booking information
 * Imported from Event model - do not duplicate
 */
export interface OrganizerEvent {
  eventId: string;
  bookings: BookingDetails[];
  totalSeatsBooked: number;
}

/**
 * User object structure (matches database model)
 * Password field is excluded for security when sending to frontend
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "organizer";
  description?: string;

  // Normal user fields (available to all users)
  bookedEvents: string[]; // Current/upcoming event bookings
  attendedEvents: string[]; // Past events that have finished

  // Organizer-specific fields (only populated if role is 'organizer')
  myEvents: OrganizerEvent[]; // Events created by organizer with booking details

  createdAt: string;
  updatedAt: string;
}

/**
 * Redux authentication state shape
 */
export interface AuthState {
  user: User | null; // Current authenticated user
  isAuthenticated: boolean; // Whether user is logged in
  loading: boolean; // Loading state for async operations
  error: string | null; // Error message if any
}

/**
 * Login form credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup form data
 */
export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "organizer";
  description?: string;
}

/**
 * API response for authentication endpoints
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}
