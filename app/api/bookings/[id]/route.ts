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
      // Find booking
      const booking = await Booking.findById(bookingId).session(session);
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

      // Check if booking is already cancelled
      if (booking.status === "cancelled") {
        await session.abortTransaction();
        return NextResponse.json(
          { success: false, message: "Booking is already cancelled" },
          { status: 400 }
        );
      }

      // Update user: remove event from bookedEvents
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { bookedEvents: booking.event },
        },
        { session }
      );

      // Delete booking (or mark as cancelled if you prefer soft delete)
      await Booking.findByIdAndDelete(bookingId).session(session);

      // Commit transaction
      await session.commitTransaction();

      // Trigger Cancellation Notification
      const { createNotification } = await import("@/lib/notifications");
      // Need to fetch event title for message, but booking is already fetched.
      // We need to re-fetch event or populate it earlier. Booking was fetched at line 32.
      // Let's rely on generic message or try to populate if possible. 
      // The snippet at line 32 was: const booking = await Booking.findById(bookingId).session(session);
      // We can check if booking.event is populated? No, it's just ID usually.
      // Let's just say "You cancelled your reservation". 
      // Or better, fetch event briefly or just use generic.

      await createNotification({
        recipient: userId,
        type: "CANCELLATION",
        message: `You cancelled your reservation.`,
        relatedEntityId: booking.event.toString(),
        relatedEntityType: "Event",
      });

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
