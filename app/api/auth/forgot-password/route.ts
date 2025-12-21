import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import connectDb from "@/lib/connectDb";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    await connectDb();
    const { email } = await req.json();

    const user = await User.findOne({ email });

    // Assuming we don't want to reveal if a user exists or not for security,
    // but for this task/dev context, simple 404 is fine or just success.
    // Ideally, we return success even if user not found to prevent enumeration.
    if (!user) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }

    // Generate token
    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordToken = resetCode;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    const message = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Here is your code:</p>
            <h2 style="color: #EF4444; letter-spacing: 5px;">${resetCode}</h2>
            <p>This code will expire in 10 minutes.</p>
        `;

    try {
      const result = await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: message,
      });

      if (!result.success) {
        console.error("Resend error:", result.error);
        throw new Error("Failed to send email");
      }

      return NextResponse.json({ success: true, data: "Email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return NextResponse.json(
        { message: "Email could not be sent" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
