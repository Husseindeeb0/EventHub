import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
} from "@/lib/auth";

/**
 * POST /api/auth/login
 *
 * Authenticates a user and issues access & refresh tokens
 * Tokens are stored as HTTP-only cookies for security
 *
 * Request Body:
 * - email: User's email address
 * - password: User's password
 *
 * Returns:
 * - 200: Login successful with user data
 * - 400: Missing credentials
 * - 401: Invalid credentials
 * - 500: Server error
 */
export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectDb();

    // Parse request body
    const { email, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken(user._id.toString());

    // Store refresh token in database for validation during token refresh
    user.refreshToken = refreshToken;
    await user.save();

    // Set tokens as HTTP-only cookies
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
