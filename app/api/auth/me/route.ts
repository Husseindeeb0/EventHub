import { NextResponse } from "next/server";
import { getAccessToken, verifyToken } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's information
 * Used to rehydrate auth state on page refresh
 */
export async function GET() {
  try {
    // Get access token from HTTP-only cookie
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = verifyToken(accessToken, "access");

    if (
      !decoded ||
      !("userId" in decoded) ||
      !("email" in decoded) ||
      !("role" in decoded)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Fetch user from database
    await connectDb();
    const user = await User.findById(decoded.userId)
      .select("-password -refreshToken")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        description: user.description,
      },
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 }
    );
  }
}
