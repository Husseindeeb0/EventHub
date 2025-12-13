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
        createdAt: user.createdAt,
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


// Updates the currently authenticated user's information
export async function PUT(request: Request) {
  try {
    // Get access token
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(accessToken, "access");
    if (!decoded || !("userId" in decoded)) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Parse body
    const { name, email, description } = await request.json();

    await connectDb();

    // Check if email is already taken by another user (if email is changing)
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: decoded.userId },
      });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $set: {
          ...(name && { name }),
          ...(email && { email }),
          ...(description !== undefined && { description }),
        },
      },
      { new: true, runValidators: true }
    )
      .select("-password -refreshToken")
      .lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        description: updatedUser.description,
        createdAt: updatedUser.createdAt,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/auth/me error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
