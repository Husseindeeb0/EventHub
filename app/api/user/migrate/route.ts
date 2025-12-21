import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import Event from "@/models/Event";
import mongoose from "mongoose";

async function doMigration(userId: string) {
  await connectDb();

  const user = await User.findById(userId);
  if (!user) {
    return { success: false, message: "User not found" };
  }

  // Handle both possible array names or missing arrays
  const bookedEvents = user.bookedEvents || [];
  const attendedEvents = user.attendedEvents || [];

  if (bookedEvents.length === 0) {
    return {
      success: true,
      message: "No booked events",
      booked: 0,
      attended: attendedEvents.length,
    };
  }

  // Find the actual event documents
  // Use string conversion to ensure compatibility with mongoose types
  const candidateIds = bookedEvents.map((id) => id.toString());
  const eventDocs = await Event.find({ _id: { $in: candidateIds } });

  if (eventDocs.length === 0) {
    return {
      success: true,
      message: "Matching events not found",
      status: "not_found",
    };
  }

  const now = new Date();
  const toMigrate: string[] = [];
  const checkedEvents: any[] = [];

  eventDocs.forEach((event) => {
    // 1. Try to find a date in any common field (handling legacy data)
    const rawDate =
      event.endsAt ||
      event.startsAt ||
      (event as any).date ||
      (event as any).startDate;
    const eventDate = rawDate ? new Date(rawDate) : null;

    // 2. Logic: If no date exists, it's an "expired" or test event.
    // We migrate it to clean up the user's booking list.
    const isPast = eventDate ? eventDate <= now : true;

    checkedEvents.push({
      title: event.title,
      dateUsed: eventDate
        ? eventDate.toISOString()
        : "No Date Found (Migrating as Expired)",
      typeUsed: event.endsAt
        ? "endsAt"
        : event.startsAt
        ? "startsAt"
        : "fallback",
      isPast,
    });

    if (isPast) {
      toMigrate.push(event._id.toString());
    }
  });

  if (toMigrate.length === 0) {
    return {
      success: true,
      message: "Checked, but no events have ended yet",
      checkedCount: eventDocs.length,
      serverTime: now.toISOString(),
      checkedEvents,
    };
  }

  try {
    // Step 1: Add to attendedEvents and Step 2: Pull from bookedEvents
    // Following USER algorithm: Add then Pull (done atomically here)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { attendedEvents: { $each: toMigrate } },
        $pull: { bookedEvents: { $in: toMigrate } },
      },
      { new: true }
    );

    return {
      success: true,
      message: `Migrated ${toMigrate.length} events successfully`,
      migratedCount: toMigrate.length,
      bookedCount: updatedUser?.bookedEvents?.length,
      attendedCount: updatedUser?.attendedEvents?.length,
      checkedEvents,
    };
  } catch (dbErr: any) {
    throw dbErr;
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.error) return authResult.response;
    const result = await doMigration(authResult.user!.userId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.error) return authResult.response;
    const result = await doMigration(authResult.user!.userId);
    return NextResponse.json({ ...result, debug: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
