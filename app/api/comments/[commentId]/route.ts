import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Comment from "@/models/Comment";
import Event from "@/models/Event";
import { getCurrentUser } from "@/lib/serverAuth";

export async function DELETE(
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

        // Fetch event to check if user is organizer
        const event = await Event.findById(comment.event);
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const isAuthor = comment.user.toString() === user.userId;
        const isOrganizer = event.organizerId === user.userId;

        if (!isAuthor && !isOrganizer) {
            return NextResponse.json(
                { error: "You are not authorized to delete this comment" },
                { status: 403 }
            );
        }

        await Comment.findByIdAndDelete(commentId);

        return NextResponse.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
