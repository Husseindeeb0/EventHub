import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IComment extends Document {
    content: string;
    event: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
    isPinned: boolean;
    replyTo?: mongoose.Types.ObjectId; // Reference to another comment
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isPinned: {
            type: Boolean,
            default: false,
        },
        replyTo: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries when fetching comments for an event
CommentSchema.index({ event: 1, createdAt: 1 });

if (models.Comment) {
    delete models.Comment;
}

const Comment = model<IComment>("Comment", CommentSchema);

export default Comment;
