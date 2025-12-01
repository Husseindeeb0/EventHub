import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import Booking from "@/models/Booking";

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(req);
    if (authResult.error) {
      return authResult.response;
    }

    const { userId } = authResult.user!;

    // Connect to database
    await connectDb();

    // Fetch all bookings for the user, populate event details
    const bookings = await Booking.find({
      user: userId,
      status: { $ne: "cancelled" },
    })
      .populate("event", "title description date time location posterImage")
      .sort({ bookingDate: -1 });

    return NextResponse.json(
      {
        success: true,
        bookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
