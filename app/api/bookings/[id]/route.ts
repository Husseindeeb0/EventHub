import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import User from "@/models/User";
import mongoose from "mongoose";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(req);
    if (authResult.error) {
      return authResult.response;
    }

    const { userId } = authResult.user!;
    const { id: bookingId } = await params;

    // Connect to database
    await connectDb();

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find booking and populate event
      const booking = await Booking.findById(bookingId)
        .populate("event")
        .session(session);
      if (!booking) {
        await session.abortTransaction();
        return NextResponse.json(
          { success: false, message: "Booking not found" },
          { status: 404 }
        );
      }

      // Verify ownership
      if (booking.user.toString() !== userId) {
        await session.abortTransaction();
        return NextResponse.json(
          { success: false, message: "Unauthorized to delete this booking" },
          { status: 403 }
        );
      }

      // Restore event capacity if applicable
      const event = booking.event as any;
      if (event && event.capacity) {
        await Event.findByIdAndUpdate(
          event._id,
          { $inc: { availableSeats: booking.seats } },
          { session }
        );
      }

      // Update user: remove event from bookedEvents
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { bookedEvents: event._id },
        },
        { session }
      );

      // Delete booking
      await Booking.findByIdAndDelete(bookingId).session(session);

      // Commit transaction
      await session.commitTransaction();

      // Trigger Notification
      try {
        const { createNotification } = await import("@/lib/notifications");
        await createNotification({
          recipient: userId,
          type: "CANCELLATION",
          message: `You successfully cancelled your reservation for "${
            event.title || "Event"
          }"`,
          relatedEntityId: event._id.toString(),
          relatedEntityType: "Event",
        });
      } catch (error) {
        console.error("Failed to create cancellation notification:", error);
      }

      return NextResponse.json(
        {
          success: true,
          message: "Booking cancelled successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
