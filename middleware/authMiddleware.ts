import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * Authentication Middleware
 *
 * Protects routes by verifying the access token from cookies
 * This middleware can be used to protect API routes that require authentication
 *
 * Usage:
 * Import this middleware in your protected API routes and call it before processing the request
 *
 * Example:
 * ```typescript
 * import { authMiddleware } from '@/middleware/authMiddleware';
 *
 * export async function GET(req: NextRequest) {
 *   const authResult = await authMiddleware(req);
 *   if (authResult.error) {
 *     return authResult.response;
 *   }
 *
 *   // Access authenticated user data
 *   const user = authResult.user;
 *   // ... rest of your route logic
 * }
 * ```
 */

export interface AuthMiddlewareResult {
  user?: {
    userId: string;
    email: string;
    role: "user" | "organizer";
  };
  error?: boolean;
  response?: NextResponse;
}

export async function authMiddleware(
  req: NextRequest
): Promise<AuthMiddlewareResult> {
  try {
    // Extract access token from cookies
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return {
        error: true,
        response: NextResponse.json(
          { success: false, message: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    // Verify token
    const decoded = verifyToken(accessToken, "access");

    // Check that decoded token has all required fields
    if (
      !decoded ||
      !("userId" in decoded) ||
      !("email" in decoded) ||
      !("role" in decoded)
    ) {
      return {
        error: true,
        response: NextResponse.json(
          { success: false, message: "Invalid or expired token" },
          { status: 401 }
        ),
      };
    }

    // Return user data from token (TypeScript now knows decoded has all required fields)
    return {
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    };
  } catch (error) {
    console.error("Auth middleware error:", error);
    return {
      error: true,
      response: NextResponse.json(
        { success: false, message: "Authentication failed" },
        { status: 401 }
      ),
    };
  }
}

/**
 * Role-based authorization check
 * Verifies that the authenticated user has the required role
 *
 * @param user - User object from authMiddleware
 * @param allowedRoles - Array of roles that are allowed to access the resource
 * @returns true if user has required role, false otherwise
 */
export function checkRole(
  user: { role: "user" | "organizer" },
  allowedRoles: ("user" | "organizer")[]
): boolean {
  return allowedRoles.includes(user.role);
}
