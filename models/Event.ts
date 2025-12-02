import mongoose, { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
    {
        organizerId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        location: {
            type: String,
        },
        startsAt: {
            type: Date,
        },
        coverImageUrl: {
            type: String,
        },
        capacity: {
            type: Number,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Event = models.Event || model("Event", EventSchema);

export default Event;
