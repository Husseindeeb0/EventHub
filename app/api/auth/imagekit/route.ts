import imagekit from "@/lib/imagekit";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        console.error("ImageKit Auth Error:", error);
        return NextResponse.json(
            { error: "ImageKit Authentication Failed" },
            { status: 500 }
        );
    }
}
