// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import connectDb from "../../../../lib/connectDb";
import EventModel from "../../../../models/Event";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDb();

    const evt = await EventModel.findById(params.id).lean();
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

    const body = await request.json();

    // Build update object only with allowed keys
    const update: Record<string, unknown> = {};
    if (typeof body.title === "string") update.title = body.title.trim();
    if (typeof body.description === "string") update.description = body.description.trim();
    if (body.date) update.date = new Date(body.date);
    if (typeof body.time === "string") update.time = body.time;
    if (typeof body.location === "string") update.location = body.location.trim();
    if (typeof body.posterUrl === "string") update.posterUrl = body.posterUrl;

    // capacity handling (number)
    if (typeof body.capacity === "number") {
      update.capacity = body.capacity;

      // If availableSeats provided explicitly, use it; otherwise adjust relative to old capacity
      if (typeof body.availableSeats === "number") {
        update.availableSeats = body.availableSeats;
      } else {
        // fetch current event to compute new availableSeats
        const current = await EventModel.findById(params.id).lean();
        if (current) {
          // determine used seats = capacity - availableSeats (old)
          const oldCapacity = typeof current.capacity === "number" ? current.capacity : 0;
          const oldAvailable = typeof current.availableSeats === "number" ? current.availableSeats : 0;
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

    const updated = await EventModel.findByIdAndUpdate(params.id, update, { new: true }).lean();
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

    const deleted = await EventModel.findByIdAndDelete(params.id).lean();
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
