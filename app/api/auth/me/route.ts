import { NextResponse } from "next/server";
import { getAccessToken, verifyToken } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import Event from "@/models/Event";
import imagekit from "@/lib/imagekit";

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
    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken"
    );

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
        imageUrl: user.imageUrl,
        imageFileId: user.imageFileId,
        coverImageUrl: user.coverImageUrl,
        coverImageFileId: user.coverImageFileId,
        bookedEvents: user.bookedEvents,
        attendedEvents: user.attendedEvents,
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
    const body = await request.json();
    console.log("PUT /api/auth/me received body:", body);
    const {
      name,
      email,
      description,
      imageUrl,
      imageFileId,
      coverImageUrl,
      coverImageFileId,
    } = body;

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

    // Get current user to check for image changes and delete old files
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Handle Profile Picture Deletion/Replacement
    if (imageUrl !== undefined && imageUrl !== currentUser.imageUrl) {
      if (currentUser.imageFileId) {
        try {
          await imagekit.deleteFile(currentUser.imageFileId);
          console.log("Deleted old profile picture:", currentUser.imageFileId);
        } catch (error) {
          console.error("Failed to delete old profile picture:", error);
        }
      }
    }

    // Handle Cover Photo Deletion/Replacement
    if (
      coverImageUrl !== undefined &&
      coverImageUrl !== currentUser.coverImageUrl
    ) {
      if (currentUser.coverImageFileId) {
        try {
          await imagekit.deleteFile(currentUser.coverImageFileId);
          console.log("Deleted old cover photo:", currentUser.coverImageFileId);
        } catch (error) {
          console.error("Failed to delete old cover photo:", error);
        }
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
          ...(imageUrl !== undefined && { imageUrl }),
          ...(imageFileId !== undefined && { imageFileId }),
          ...(coverImageUrl !== undefined && { coverImageUrl }),
          ...(coverImageFileId !== undefined && { coverImageFileId }),
        },
      },
      { new: true, runValidators: true, strict: false }
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
        imageUrl: updatedUser.imageUrl,
        imageFileId: updatedUser.imageFileId,
        coverImageUrl: updatedUser.coverImageUrl,
        coverImageFileId: updatedUser.coverImageFileId,
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
