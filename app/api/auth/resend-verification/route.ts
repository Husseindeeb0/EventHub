import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import connectDb from "@/lib/connectDb";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
    try {
        await connectDb();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json(
                { message: "Email is already verified" },
                { status: 400 }
            );
        }

        // Generate new token
        // Generate new 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        user.verificationToken = verificationCode;
        user.verificationTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await user.save();

        const message = `
      <h1>Email Verification - Resend</h1>
      <p>Your verification code is:</p>
      <h2 style="color: #4F46E5; letter-spacing: 5px;">${verificationCode}</h2>
      <p>This code will expire in 24 hours.</p>
    `;

        try {
            const result = await sendEmail({
                to: user.email,
                subject: "Email Verification - Resend",
                html: message,
            });

            if (!result.success) {
                console.error("Resend error:", result.error);
                throw new Error("Failed to send email");
            }

            return NextResponse.json({ success: true, message: "Verification email sent" });
        } catch (err) {
            return NextResponse.json(
                { message: "Email could not be sent" },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
