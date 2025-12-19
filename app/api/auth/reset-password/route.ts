import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDb from "@/lib/connectDb";

export async function POST(req: Request) {
    try {
        await connectDb();
        const { email, code, password } = await req.json();

        if (!email || !code || !password) {
            return NextResponse.json({ message: "Email, code, and password are required" }, { status: 400 });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
            resetPasswordToken: code,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired reset code" },
                { status: 400 }
            );
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return NextResponse.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        return NextResponse.json(
            { message: "Error resetting password" },
            { status: 500 }
        );
    }
}
