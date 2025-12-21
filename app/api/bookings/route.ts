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

      // Check if event has capacity and enough available seats
      if (event.capacity) {
        const bookedCount = await Booking.countDocuments({
          event: eventId,
          status: { $ne: "cancelled" },
        }).session(session);

        const availableSeats = event.capacity - bookedCount;
        if (availableSeats < seats) {
          await session.abortTransaction();
          return NextResponse.json(
            {
              success: false,
              message: `Only ${availableSeats} seats available`,
            },
            { status: 400 }
          );
        }
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

      // Update user: add event to bookedEvents
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { bookedEvents: eventId },
        },
        { session }
      );

      // Update event availableSeats
      // Note: event is already fetched at line 39
      if (event.capacity) {
        await Event.findByIdAndUpdate(
          eventId,
          { $inc: { availableSeats: -seats } },
          { session }
        );
      }

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

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(req);
    if (authResult.error) {
      return authResult.response;
    }

    const { userId } = authResult.user!;

    await connectDb();

    const user = await User.findById(userId).select("bookedEvents");
    const bookedEventIds = user?.bookedEvents || [];

    // Find bookings for user and populate event details
    const bookings = await Booking.find({
      user: userId,
      status: { $ne: "cancelled" },
      event: { $in: bookedEventIds },
    })
      .populate("event")
      .sort({ bookingDate: -1 })
      .lean();

    // Map to expected format
    const formattedBookings = bookings
      .map((booking: any) => {
        if (!booking.event) return null; // Skip if event was deleted

        return {
          _id: booking._id,
          eventId: booking.event._id,
          title: booking.event.title,
          location: booking.event.location,
          startsAt: booking.event.startsAt
            ? new Date(booking.event.startsAt).toISOString()
            : null,
          endsAt: booking.event.endsAt
            ? new Date(booking.event.endsAt).toISOString()
            : null,
          coverImageUrl: booking.event.coverImageUrl || "",
          capacity: booking.event.capacity,
          description: booking.event.description || "",
          numberOfSeats: booking.seats,
          bookedAt: booking.bookingDate
            ? new Date(booking.bookingDate).toISOString()
            : new Date().toISOString(),
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
