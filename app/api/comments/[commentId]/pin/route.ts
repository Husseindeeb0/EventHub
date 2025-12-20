import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Comment from "@/models/Comment";
import Event from "@/models/Event";
import { getCurrentUser } from "@/lib/serverAuth";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ commentId: string }> }
) {
    try {
        const { commentId } = await params;
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDb();

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        // Verify user is the organizer
        const event = await Event.findById(comment.event);
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        if (event.organizerId !== user.userId) {
            return NextResponse.json(
                { error: "Only the organizer can pin messages" },
                { status: 403 }
            );
        }

        // Toggle pin status
        comment.isPinned = !comment.isPinned;
        await comment.save();

        return NextResponse.json({
            isPinned: comment.isPinned,
            message: comment.isPinned ? "Message pinned" : "Message unpinned"
        });
    } catch (error) {
        console.error("Error pinning comment:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
