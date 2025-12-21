import { NextResponse } from "next/server";
import { getAccessToken, verifyToken } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";

export async function GET() {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const decoded = verifyToken(accessToken, "access");
        if (!decoded || !("userId" in decoded)) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        await connectDb();

        // Find the current user and populate the 'followers' array
        const user = await User.findById(decoded.userId).populate({
            path: "followers",
            select: "name email imageUrl role", // We don't necessarily need their followers count unless we want to show it
            model: "User",
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Map to a cleaner structure
        // Map to a cleaner structure
        // Filter out nulls first (in case a follower was deleted)
        const followers = user.followers
            .filter((follower: any) => follower !== null)
            .map((follower: any) => ({
                _id: follower._id,
                name: follower.name,
                email: follower.email,
                imageUrl: follower.imageUrl,
                role: follower.role,
            }));

        return NextResponse.json({
            success: true,
            followers,
        });
    } catch (error) {
        console.error("GET /api/user/followers error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
