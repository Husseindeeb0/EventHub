import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Comment from "@/models/Comment";
import Event from "@/models/Event";
import { getCurrentUser } from "@/lib/serverAuth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDb();

        // Verify event exists
        const event = await Event.findById(id);
        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        // Fetch comments
        const comments = await Comment.find({ event: id })
            .sort({ createdAt: 1 }) // Oldest first
            .populate("user", "name imageUrl")
            .populate({
                path: "replyTo",
                select: "content user",
                populate: { path: "user", select: "name" }
            })
            .lean();

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content, replyTo } = body;

        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        await connectDb();

        // Verify event exists
        const event = await Event.findById(id);
        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        // Create comment
        const newComment = await Comment.create({
            content,
            event: id,
            user: user.userId,
            replyTo: replyTo || null,
        });

        // Populate user info & replyTo before returning
        await newComment.populate([
            { path: "user", select: "name imageUrl" },
            {
                path: "replyTo",
                select: "content user",
                populate: { path: "user", select: "name" }
            }
        ]);

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
