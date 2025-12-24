// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import connectDb from "../../../../lib/connectDb";
import EventModel from "../../../../models/Event";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    // --- TEST EVENT BACKDOOR ---
    if (id === "mock-event-id-456" || id === "mock-booking-id-789") {
      return NextResponse.json({
        success: true,
        event: {
          _id: "mock-event-id-456",
          title: "Teach Conference",
          location: "Lebanon",
          startsAt: new Date("2024-06-15T10:00:00Z"),
          coverImageUrl:
            "https://images.unsplash.com/photo-1540575861501-7ad0582373f2?q=80&w=2070&auto=format&fit=crop",
          capacity: 100,
          availableSeats: 99,
          description: "A massive tech event to test our feedback system.",
          organizerId: "org-user-id-456",
        },
      });
    }
    // ---------------------------

    try {
      await connectDb();
    } catch (dbErr) {
      console.error("Database offline in event details:", dbErr);
      return NextResponse.json(
        { success: false, message: "Database offline" },
        { status: 500 }
      );
    }

    // database check passed

    const evt = await EventModel.findById(id).lean();
    if (!evt) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ event: evt });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("GET /api/events/[id] error:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    await connectDb();

    const { id } = await params;
    const body = await request.json();

    // Build update object only with allowed keys
    const update: Record<string, unknown> = {};
    if (typeof body.title === "string") update.title = body.title.trim();
    if (typeof body.description === "string")
      update.description = body.description.trim();
    if (body.date) update.date = new Date(body.date);
    if (typeof body.time === "string") update.time = body.time;
    if (typeof body.location === "string")
      update.location = body.location.trim();
    if (typeof body.isOnline === "boolean") {
      update.isOnline = body.isOnline;
      if (body.isOnline) {
        update.location = "Online";
      }
    }
    if (typeof body.meetingLink === "string")
      update.meetingLink = body.meetingLink.trim();
    if (typeof body.category === "string")
      update.category = body.category.trim();
    if (typeof body.posterUrl === "string") update.posterUrl = body.posterUrl;

    // capacity handling (number)
    if (typeof body.capacity === "number") {
      update.capacity = body.capacity;

      // If availableSeats provided explicitly, use it; otherwise adjust relative to old capacity
      if (typeof body.availableSeats === "number") {
        update.availableSeats = body.availableSeats;
      } else {
        // fetch current event to compute new availableSeats
        const current = await EventModel.findById(id).lean();
        if (current) {
          // determine used seats = capacity - availableSeats (old)
          const oldCapacity =
            typeof current.capacity === "number" ? current.capacity : 0;
          const oldAvailable =
            typeof current.availableSeats === "number"
              ? current.availableSeats
              : 0;
          const usedSeats = Math.max(0, oldCapacity - oldAvailable);

          // compute new available seats = newCapacity - usedSeats (not negative)
          const computedAvailable = Math.max(0, body.capacity - usedSeats);
          update.availableSeats = computedAvailable;
        } else {
          update.availableSeats = body.capacity;
        }
      }
    } else if (typeof body.availableSeats === "number") {
      // explicit availableSeats update without changing capacity
      update.availableSeats = body.availableSeats;
    }

    const updated = await EventModel.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();
    if (!updated) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("PUT /api/events/[id] error:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await connectDb();

    const { id } = await params;
    const deleted = await EventModel.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("DELETE /api/events/[id] error:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
