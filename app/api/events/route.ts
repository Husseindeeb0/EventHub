import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import User from "@/models/User";
import Booking from "@/models/Booking";

function toISO(d: any) {
  if (!d) return new Date().toISOString();
  if (typeof d === "string") return new Date(d).toISOString();
  return (d as Date).toISOString();
}

export async function GET(req: Request) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const organizerId = searchParams.get("organizerId");

    const query: any = {};
    if (organizerId) {
      query.organizerId = organizerId;
    }

    const idsParam = searchParams.get("ids");
    if (idsParam) {
      const idsArray = idsParam.split(",");
      query._id = { $in: idsArray };
    }

    const rawEvents: any[] = await Event.find(query)
      .sort({ startsAt: organizerId ? -1 : 1 }) // Descending for organizer (newest first), Ascending for public (soonest first)
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
      const organizerId = e.organizerId;

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
        organizerId,
      };
    });

    return NextResponse.json({ success: true, events });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("GET /api/events error:", message, err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    const body = await req.json();

    const {
      title,
      location,
      startsAt,
      capacity,
      description,
      coverImageUrl,
      organizerId,
    } = body;

    // Basic validation
    if (!title || !location || !startsAt || !organizerId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate capacity
    if (capacity !== undefined && (isNaN(capacity) || capacity < 1)) {
      return NextResponse.json(
        { success: false, message: "Capacity must be a positive number" },
        { status: 400 }
      );
    }

    const newEvent = await Event.create({
      title,
      location,
      startsAt: new Date(startsAt),
      organizerId,
      capacity,
      description: description || undefined,
      coverImageUrl: coverImageUrl || undefined,
    });

    // Add event to user's createdEvents array
    await User.findByIdAndUpdate(organizerId, {
      $push: { createdEvents: newEvent._id },
    });

    return NextResponse.json(
      { success: true, event: newEvent },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("POST /api/events error:", message, err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
