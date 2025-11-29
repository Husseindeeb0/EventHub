import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

/**
 * POST /api/auth/signup
 *
 * Handles user registration for both Normal Users and Organizers
 * Creates a new user account with hashed password
 *
 * Request Body:
 * - name: User's full name
 * - email: User's email address (must be unique)
 * - password: User's password (will be hashed)
 * - role: 'user' or 'organizer'
 * - description: Optional user bio/description
 *
 * Returns:
 * - 201: User created successfully
 * - 400: Validation error or user already exists
 * - 500: Server error
 */
export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectDb();

    // Parse request body
    const { name, email, password, role, description } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !["user", "organizer"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid role. Must be "user" or "organizer"',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "user", // Default to 'user' if not specified
      description: description || "",
  } catch (error: any) {
    console.error("Signup error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { success: false, message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
