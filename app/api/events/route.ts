import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import Booking from "@/models/Booking";

function toISO(d: any) {
  if (!d) return new Date().toISOString();
  if (typeof d === "string") return new Date(d).toISOString();
  return (d as Date).toISOString();
}

export async function GET() {
  try {
    await connectDb();

    const rawEvents: any[] = await Event.find({})
      .sort({ startsAt: 1 }) // Ascending order for upcoming events
      .lean();

    const ids = rawEvents.map((e) => e._id);

    // Get booking counts for all events from Booking collection
    // Count only confirmed bookings (exclude cancelled ones)
    const counts: Array<{ _id: any; count: number }> = await Booking.aggregate([
      { 
        $match: { 
          event: { $in: ids },
          status: { $ne: "cancelled" }
        } 
      },
      { $group: { _id: "$event", count: { $sum: 1 } } },
    ]);

    const map = new Map<string, number>();
    for (const c of counts) {
      // Convert ObjectId to string for matching
      map.set(String(c._id), c.count);
    }

    const events = rawEvents.map((e) => {
      const title = e.title ?? e.name ?? "Untitled event";
      const location = e.location ?? e.venue ?? "TBA";
      const startsAt = toISO(e.startsAt ?? e.date ?? e.startDate);
      const coverImageUrl = e.coverImageUrl ?? e.imageUrl ?? e.image;
      const capacity = e.capacity ?? e.maxSeats ?? undefined;

      const id = String(e._id);
      const bookedCount = map.get(id) ?? 0;

      return {
        id,
        title,
        location,
        startsAt,
        coverImageUrl,
        capacity,
        bookedCount,
      };
    });

    return NextResponse.json({ success: true, events });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("GET /api/events error:", message, err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
