import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectDb();
    // Get all unique categories from the Event collection
    // Filter out null/undefined values
    const categories = await Event.distinct("category", {
      category: { $ne: null },
    });

    return NextResponse.json({
      success: true,
      categories: categories.sort(),
    });
  } catch (err: any) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
