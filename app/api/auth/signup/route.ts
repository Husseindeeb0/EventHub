import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
} from "@/lib/auth";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { name, email, password, role, description } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    if (role && !["user", "organizer"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid role. Must be "user" or "organizer"',
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "user",
      description: description || "",
      isVerified: false,
      verificationToken: verificationCode,
      verificationTokenExpire: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    const message = `
      <h1>Email Verification</h1>
      <p>Your verification code is:</p>
      <h2 style="color: #4F46E5; letter-spacing: 5px;">${verificationCode}</h2>
      <p>This code will expire in 24 hours.</p>
    `;

    try {
      const result = await sendEmail({
        to: newUser.email,
        subject: "Email Verification",
        html: message,
      });
      if (!result.success) {
        console.error("Error sending verification email:", result.error);
      }
    } catch (emailError) {
      console.error("Unexpected error sending verification email", emailError);
    }


    // Generate tokens for auto-login
    const accessToken = generateAccessToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    const refreshToken = generateRefreshToken(newUser._id.toString());

    newUser.refreshToken = refreshToken;
    await newUser.save();

    await setTokenCookies(accessToken, refreshToken);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          description: newUser.description,
          bookedEvents: newUser.bookedEvents,
          attendedEvents: newUser.attendedEvents,
          createdEvents: newUser.createdEvents,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
