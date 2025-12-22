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

        const user = await User.findById(decoded.userId).populate({
            path: "following",
            select: "name email imageUrl followers role",
            model: "User",
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Map to a cleaner structure
        // Filter out nulls first (in case a followed user was deleted)
        const following = user.following
            .filter((followedUser: any) => followedUser !== null)
            .map((followedUser: any) => ({
                _id: followedUser._id,
                name: followedUser.name,
                email: followedUser.email,
                imageUrl: followedUser.imageUrl,
                role: followedUser.role,
                followersCount: followedUser.followers ? followedUser.followers.length : 0,
            }));

        return NextResponse.json({
            success: true,
            following,
        });
    } catch (error) {
        console.error("GET /api/user/following error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
