import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import {
  getRefreshToken,
  verifyToken,
  generateAccessToken,
  setTokenCookies,
  generateRefreshToken,
} from "@/lib/auth";

/**
 * POST /api/auth/refresh
 *
 * Refreshes the access token using a valid refresh token
 * Implements token rotation for enhanced security (optional)
 *
 * Process:
 * 1. Extract refresh token from cookies
 * 2. Verify refresh token is valid and not expired
 * 3. Check refresh token matches the one stored in database
 * 4. Generate new access token (and optionally new refresh token)
 * 5. Update cookies with new tokens
 *
 * Returns:
 * - 200: Token refreshed successfully
 * - 401: Invalid or missing refresh token
 * - 500: Server error
 */
export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectDb();

    // Get refresh token from cookies
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token not found" },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, "refresh");
    if (!decoded || !("userId" in decoded)) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Find user and verify refresh token matches database
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Optional: Rotate refresh token for enhanced security
    // Uncomment the following lines to enable refresh token rotation
    /*
    const newRefreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = newRefreshToken;
    await user.save();
    await setTokenCookies(newAccessToken, newRefreshToken);
    */

    // For now, just update the access token cookie
    await setTokenCookies(newAccessToken, refreshToken);

    return NextResponse.json(
      { success: true, message: "Token refreshed successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during token refresh" },
      { status: 500 }
    );
  }
}
