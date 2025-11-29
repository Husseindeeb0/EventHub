import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/**
 * Authentication Utility Functions
 * Provides core authentication functionality including password hashing,
 * token generation/verification, and cookie management
 */

// JWT Secret Keys - Should be stored in environment variables
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret";

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

/**
 * Payload structure for JWT tokens
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "organizer";
}

/**
 * Hash a plain text password using bcrypt
 * Uses salt rounds of 10 for security
 *
 * @param password - Plain text password to hash
 * @returns Promise resolving to hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 *
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a short-lived access token
 * Used for authenticating API requests
 *
 * @param payload - User data to encode in token
 * @returns JWT access token string
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

/**
 * Generate a long-lived refresh token
 * Used to obtain new access tokens without re-authentication
 *
 * @param userId - User ID to encode in token
 * @returns JWT refresh token string
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

/**
 * Verify and decode a JWT token
 *
 * @param token - JWT token to verify
 * @param type - Token type ('access' or 'refresh')
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(
  token: string,
  type: "access" | "refresh" = "access"
): TokenPayload | { userId: string } | null {
  try {
    const secret =
      type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
    return jwt.verify(token, secret) as TokenPayload | { userId: string };
  } catch (error) {
    console.error(`Token verification failed (${type}):`, error);
    return null;
  }
}

/**
 * Set authentication tokens as HTTP-only cookies
 * Cookies are secure and cannot be accessed via JavaScript (XSS protection)
 *
 * @param accessToken - Access token to set
 * @param refreshToken - Refresh token to set
 */
export async function setTokenCookies(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const cookieStore = await cookies();

  // Set access token cookie (15 minutes)
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true, // Cannot be accessed via JavaScript
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax", // CSRF protection
    maxAge: 15 * 60, // 15 minutes in seconds
    path: "/", // Available across entire site
  });

  // Set refresh token cookie (7 days)
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/",
  });
}

/**
 * Clear authentication cookies
 * Used during logout to remove tokens from client
 */
export async function clearTokenCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

/**
 * Get access token from cookies
 *
 * @returns Access token string or undefined if not found
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

/**
 * Get refresh token from cookies
 *
 * @returns Refresh token string or undefined if not found
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value;
}
