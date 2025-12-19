import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import connectDb from "@/lib/connectDb";

export async function POST(req: Request) {
    try {
        await connectDb();
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ message: "Email and code are required" }, { status: 400 });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
            verificationToken: code,
            verificationTokenExpire: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired verification code" },
                { status: 400 }
            );
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save();

        return NextResponse.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        return NextResponse.json(
            { message: "Error verifying email" },
            { status: 500 }
        );
    }
}
