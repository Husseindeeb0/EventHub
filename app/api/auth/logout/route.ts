import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import { getAccessToken, verifyToken, clearTokenCookies } from "@/lib/auth";

/**
 * POST /api/auth/logout
 *
 * Logs out the current user by:
 * 1. Removing refresh token from database (invalidates future refresh attempts)
 * 2. Clearing authentication cookies from client
 *
 * Returns:
 * - 200: Logout successful
 * - 401: Not authenticated
 * - 500: Server error
 */
export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectDb();

    // Get access token from cookies
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token and extract user ID
    const decoded = verifyToken(accessToken, "access");
    if (!decoded || !("userId" in decoded)) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Remove refresh token from database
    // This prevents the refresh token from being used to generate new access tokens
    await User.findByIdAndUpdate(decoded.userId, {
      refreshToken: null,
    });

    // Clear authentication cookies
    await clearTokenCookies();

    return NextResponse.json(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
