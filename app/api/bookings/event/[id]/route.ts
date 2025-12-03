import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, checkRole } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import Booking from "@/models/Booking";
import Event from "@/models/Event";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(req);
    if (authResult.error) {
      return authResult.response;
    }

    const user = authResult.user!;

    // Check if user is an organizer
    if (!checkRole(user, ["organizer"])) {
      return NextResponse.json(
        { success: false, message: "Only organizers can view event bookings" },
        { status: 403 }
      );
    }

    const { id: eventId } = await params;

    // Connect to database
    await connectDb();

    // Verify that the event exists and belongs to the organizer
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // Fetch all bookings for the event, populate user details
    const bookings = await Booking.find({
      event: eventId,
      status: { $ne: "cancelled" },
    })
      .populate("user", "name email")
      .sort({ bookingDate: -1 });

    return NextResponse.json(
      {
        success: true,
        bookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch event bookings" },
      { status: 500 }
    );
  }
}
