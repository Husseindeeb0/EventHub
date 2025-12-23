import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // --- TEST USER BACKDOOR ---
    // Specifically for eventhub172@gmail.com to allow testing without needing DB verification
    if (email.toLowerCase() === 'eventhub172@gmail.com' && password === '1m984mmm') {
      const testUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Tester',
        email: 'eventhub172@gmail.com',
        role: 'user',
        isVerified: true,
      };

      const accessToken = generateAccessToken({
        userId: testUser._id,
        email: testUser.email,
        role: testUser.role as any,
      });

      const refreshToken = generateRefreshToken(testUser._id);
      await setTokenCookies(accessToken, refreshToken);

      return NextResponse.json({
        success: true,
        message: "Login successful (Test Mode)",
        user: {
          ...testUser,
          bookedEvents: [],
          attendedEvents: [],
          createdEvents: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }, { status: 200 });
    }
    // ---------------------------

    try {
      await connectDb();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        { success: false, message: "Server is currently unable to connect to the database" },
        { status: 500 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email address before logging in",
          isVerified: false,
        },
        { status: 403 }
      );
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    await setTokenCookies(accessToken, refreshToken);

    // Trigger Login Notification
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      recipient: user._id.toString(),
      type: "LOGIN",
      message: `You logged in on ${new Date().toLocaleDateString()}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          description: user.description,
          bookedEvents: user.bookedEvents,
          attendedEvents: user.attendedEvents,
          createdEvents: user.createdEvents,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
