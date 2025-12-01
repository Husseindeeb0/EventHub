import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(req);
    if (authResult.error) {
      return authResult.response;
    }

    const { userId } = authResult.user!;

    // Parse request body
    const { eventId, seats } = await req.json();

    // Validate input
    if (!eventId || !seats || seats < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid booking data" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDb();

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find event
      const event = await Event.findById(eventId).session(session);
      if (!event) {
        await session.abortTransaction();
        return NextResponse.json(
          { success: false, message: "Event not found" },
          { status: 404 }
        );
      }

      // Check if event has enough available seats
      if (event.availableSeats < seats) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            success: false,
            message: `Only ${event.availableSeats} seats available`,
          },
          { status: 400 }
        );
      }

      // Check if user already booked this event
      const existingBooking = await Booking.findOne({
        user: userId,
        event: eventId,
        status: "confirmed",
      }).session(session);

      if (existingBooking) {
        await session.abortTransaction();
        return NextResponse.json(
          { success: false, message: "You have already booked this event" },
          { status: 400 }
        );
      }

      // Create booking
      const booking = await Booking.create(
        [
          {
            user: userId,
            event: eventId,
            seats,
            status: "confirmed",
          },
        ],
        { session }
      );

      // Update event: decrement available seats and add user to attendees
      await Event.findByIdAndUpdate(
        eventId,
        {
          $inc: { availableSeats: -seats },
          $addToSet: { attendees: userId },
        },
        { session }
      );

      // Update user: add event to bookedEvents
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { bookedEvents: eventId },
        },
        { session }
      );

      // Commit transaction
      await session.commitTransaction();

      return NextResponse.json(
        {
          success: true,
          message: "Booking created successfully",
          booking: booking[0],
        },
        { status: 201 }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create booking" },
      { status: 500 }
    );
  }
}
