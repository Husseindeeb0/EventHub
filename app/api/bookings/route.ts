import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import User from "@/models/User";
import Review from "@/models/Review";
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
    const { eventId, seats, name, email, phone } = await req.json();

    // Validate input
    if (!eventId || !seats || seats < 1 || !name || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking data. Please fill all fields.",
        },
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
            name,
            email,
            phone,
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
      // Update event availableSeats
      if (event.capacity) {
        await Event.findByIdAndUpdate(
          eventId,
          { $inc: { availableSeats: -seats } },
          { session }
        );
      }

      // Commit transaction
      await session.commitTransaction();

      // Trigger Notification (outside transaction to avoid blocking)
      try {
        const { createNotification } = await import("@/lib/notifications");
        await createNotification({
          recipient: userId,
          type: "RESERVATION",
          message: `You successfully reserved a spot for "${event.title}"`,
          relatedEntityId: eventId,
          relatedEntityType: "Event",
        });
      } catch (error) {
        console.error("Failed to create reservation notification:", error);
      }

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

    try {
      await connectDb();
    } catch (dbError) {
      console.error("Database connection failed in /api/bookings:", dbError);
      return NextResponse.json(
        {
          success: false,
          message: "Server is currently unable to connect to the database",
        },
        { status: 500 }
      );
    }

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

    // Fetch user reviews for these events
    const reviews = await Review.find({
      user: userId,
      event: { $in: bookedEventIds },
    }).lean();

    const reviewMap: Record<string, number> = {};
    reviews.forEach((review: any) => {
      reviewMap[review.event.toString()] = review.rating;
    });

    // Collect all organizer IDs
    const organizerIds = bookings
      .map((b: any) => b.event?.organizerId)
      .filter((id) => id); // Filter out undefined/null

    // Fetch organizers
    const organizers = await User.find({ _id: { $in: organizerIds } })
      .select("name email imageUrl")
      .lean();

    const organizerMap = organizers.reduce((acc: any, org: any) => {
      acc[org._id.toString()] = org;
      return acc;
    }, {});

    // Map to expected format
    const formattedBookings = bookings
      .map((booking: any) => {
        if (!booking.event) return null; // Skip if event was deleted

        const organizer = organizerMap[booking.event.organizerId];

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
          averageRating: booking.event.averageRating || 0,
          ratingCount: booking.event.ratingCount || 0,
          userRating: reviewMap[booking.event._id.toString()] || null,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          userId: booking.user,
          organizer: organizer
            ? {
                _id: organizer._id.toString(),
                name: organizer.name,
                email: organizer.email,
                imageUrl: organizer.imageUrl,
              }
            : null,
        };
      })
      .filter(Boolean);

    // Check if user has already given feedback
    const feedbackExists = await import("@/models/Feedback").then((m) =>
      m.default.exists({ user: userId })
    );
    const hasGivenFeedback = !!feedbackExists;

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
      hasGivenFeedback,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
