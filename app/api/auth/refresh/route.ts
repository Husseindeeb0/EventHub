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

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token not found" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(refreshToken, "refresh");
    if (!decoded || !("userId" in decoded)) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

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
