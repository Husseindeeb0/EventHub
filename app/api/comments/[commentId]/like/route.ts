import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDb from "@/lib/connectDb";
import Comment from "@/models/Comment";
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

    // Toggle like
    const userIdObj = new mongoose.Types.ObjectId(user.userId);
    const likeIndex = comment.likes.findIndex(
      (id: any) => id.toString() === user.userId
    );

    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like
      comment.likes.push(userIdObj as any);
    }

    await comment.save();

    return NextResponse.json({
      likes: comment.likes,
      userId: user.userId,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
