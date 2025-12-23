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
    try {
      await connectDb();
    } catch (dbErr) {
      console.error("Database offline, providing mock events:", dbErr);
      // Fallback for when MongoDB is down
      return NextResponse.json({
        success: true,
        events: [
          {
            id: 'mock-event-id-456',
            title: 'Teach Conference',
            location: 'Lebanon',
            startsAt: new Date('2024-06-15T10:00:00Z').toISOString(),
            coverImageUrl: 'https://images.unsplash.com/photo-1540575861501-7ad0582373f2?q=80&w=2070&auto=format&fit=crop',
            capacity: 100,
            bookedCount: 1,
            organizerId: 'org-user-id-456',
          }
        ]
      });
    }

    const { searchParams } = new URL(req.url);
    const organizerId = searchParams.get("organizerId");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const status = searchParams.get("status"); // 'active', 'finished', or null (both)

    const query: any = {};
    if (organizerId) {
      query.organizerId = organizerId;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const now = new Date();
    if (status === "active") {
      // Active means it hasn't ended yet
      query.$or = [
        { endsAt: { $gt: now } },
        { endsAt: { $exists: false }, startsAt: { $gt: now } },
      ];
    } else if (status === "finished") {
      // Finished means it has already ended
      query.$or = [
        { endsAt: { $lte: now } },
        { endsAt: { $exists: false }, startsAt: { $lte: now } },
      ];
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
          status: { $ne: "cancelled" },
        },
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
      const endsAt = e.endsAt ? toISO(e.endsAt) : undefined;
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
        endsAt,
        coverImageUrl,
        capacity,
        bookedCount,
        organizerId,
        averageRating: e.averageRating || 0,
        ratingCount: e.ratingCount || 0,
        category: e.category,
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
      endsAt,
      capacity,
      category,
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
      endsAt: endsAt ? new Date(endsAt) : undefined,
      organizerId,
      capacity,
      availableSeats: capacity, // Initialize availableSeats with capacity
      category: category || "Other",
      description: description || undefined,
      coverImageUrl: coverImageUrl || undefined,
    });

    // Add event to user's createdEvents array
    await User.findByIdAndUpdate(organizerId, {
      $push: { createdEvents: newEvent._id },
    });

    // Notify followers
    const { createNotification } = await import("@/lib/notifications");
    const organizer = await User.findById(organizerId).select("followers name");
    if (organizer && organizer.followers && organizer.followers.length > 0) {
      for (const followerId of organizer.followers) {
        await createNotification({
          recipient: followerId.toString(),
          sender: organizerId,
          type: "NEW_EVENT_FROM_FOLLOWING",
          message: `${organizer.name} posted a new event: ${newEvent.title}`,
          relatedEntityId: newEvent._id.toString(),
          relatedEntityType: "Event",
        });
      }
    }

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
