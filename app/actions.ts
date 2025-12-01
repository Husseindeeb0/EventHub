"use server";

import { redirect } from "next/navigation";
import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import Booking from "@/models/Booking";

export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const startsAt = formData.get("startsAt") as string;
  const capacityStr = formData.get("capacity") as string;
  const description = formData.get("description") as string;
  const coverImageUrl = formData.get("coverImageUrl") as string;

  if (!title || !location || !startsAt) {
    throw new Error("Missing required fields");
  }

  await connectDb();

  // TODO: Get real organizer ID from session
  const organizerId = "user_organizer_1";

  // Parse capacity - if provided and valid, convert to number, otherwise undefined (unlimited)
  const capacity =
    capacityStr && capacityStr.trim() !== ""
      ? parseInt(capacityStr, 10)
      : undefined;

  // Validate capacity if provided
  if (capacity !== undefined && (isNaN(capacity) || capacity < 1)) {
    throw new Error("Capacity must be a positive number");
  }

  // Validate and clean coverImageUrl - only set if it's a valid non-empty URL
  const imageUrl =
    coverImageUrl && coverImageUrl.trim() !== ""
      ? coverImageUrl.trim()
      : undefined;

  const newEvent = await Event.create({
    title,
    location,
    startsAt: new Date(startsAt),
    organizerId,
    capacity: capacity, // undefined means unlimited
    description: description || undefined,
    coverImageUrl: imageUrl, // undefined means no image
  });

  redirect(`/events/${newEvent._id}/invite`);
}

export async function updateEventAction(formData: FormData) {
  const id = formData.get("eventId") as string;
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const startsAt = formData.get("startsAt") as string;
  const capacityStr = formData.get("capacity") as string;
  const description = formData.get("description") as string;
  const coverImageUrl = formData.get("coverImageUrl") as string;

  if (!id || !title || !location || !startsAt) {
    throw new Error("Missing required fields");
  }

  await connectDb();

  // Parse capacity - if provided and valid, convert to number, otherwise undefined (unlimited)
  const capacity =
    capacityStr && capacityStr.trim() !== ""
      ? parseInt(capacityStr, 10)
      : undefined;

  // Validate capacity if provided
  if (capacity !== undefined && (isNaN(capacity) || capacity < 1)) {
    throw new Error("Capacity must be a positive number");
  }

  // Validate and clean coverImageUrl - only set if it's a valid non-empty URL
  const imageUrl =
    coverImageUrl && coverImageUrl.trim() !== ""
      ? coverImageUrl.trim()
      : undefined;

  await Event.findByIdAndUpdate(id, {
    title,
    location,
    startsAt: new Date(startsAt),
    capacity: capacity, // undefined means unlimited
    description: description || undefined,
    coverImageUrl: imageUrl, // undefined means no image
  });

  redirect(`/events/${id}`);
}

export async function deleteEventAction(formData: FormData) {
  const id = formData.get("eventId") as string;

  if (!id) {
    throw new Error("Missing event ID");
  }

  await connectDb();
  await Event.findByIdAndDelete(id);
  redirect("/myEvents");
}

export async function bookEventAction(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (!eventId || !firstName || !lastName) {
    throw new Error("Missing required fields");
  }

  await connectDb();

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Check capacity if event has one
  if (event.capacity) {
    const bookedCount = await Booking.countDocuments({ eventId });
    if (bookedCount >= event.capacity) {
      throw new Error("Event is fully booked");
    }
  }

  // Create booking
  await Booking.create({
    eventId,
    firstName,
    lastName,
  });

  redirect(`/events/${eventId}?booked=true`);
}
