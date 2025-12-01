// app/api/events/route.ts
import { NextResponse } from "next/server";
import connectDb from "../../../lib/connectDb";
import EventModel from "../../../models/Event";

export async function GET(request: Request) {
  try {
    await connectDb();

    const url = new URL(request.url);
    const searchParam = url.searchParams.get("search") ?? "";
    const dateParam = url.searchParams.get("date") ?? "";
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = Number(url.searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const filterObj: Record<string, unknown> = {};

    if (searchParam) {
      filterObj.$or = [
        { title: { $regex: searchParam, $options: "i" } },
        { description: { $regex: searchParam, $options: "i" } },
        { location: { $regex: searchParam, $options: "i" } },
      ];
    }

    if (dateParam) {
      // filter for the given UTC date (YYYY-MM-DD)
      const start = new Date(dateParam);
      const end = new Date(dateParam);
      end.setDate(end.getDate() + 1);
      filterObj.date = { $gte: start, $lt: end };
    }

    const filter: Record<string, unknown> = filterObj;

    const total = await EventModel.countDocuments(filter);
    const events = await EventModel.find(filter)
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({ events, total, page, limit });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("GET /api/events error:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    await connectDb();

    const body = await request.json();

    const {
      title,
      description,
      date,
      time,
      location,
      capacity,
      posterUrl,
      createdBy,
    } = body as {
      title?: string;
      description?: string;
      date?: string;
      time?: string;
      location?: string;
      capacity?: number;
      posterUrl?: string;
      createdBy?: string;
    };

    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !location ||
      capacity === undefined ||
      !createdBy
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // شكل المدخلات الآمنة كـ object مستقل عن الـ Document type
    const newEventData = {
      title: title.trim(),
      description: description.trim(),
      date: new Date(date),
      time,
      location: location.trim(),
      capacity,
      posterUrl: posterUrl ?? "",
      createdBy: createdBy.trim(),
      attendees: [] as string[],
      availableSeats: capacity,
    };

    // create via constructor + save (أفضل توافق مع TypeScript)
    const doc = new EventModel(newEventData);
    const saved = await doc.save();

    return NextResponse.json({ event: saved }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    console.error("POST /api/events error:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
