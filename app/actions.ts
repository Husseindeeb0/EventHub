"use server";

import { redirect } from "next/navigation";
import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { requireOrganizer, requireAuth } from "@/lib/serverAuth";

export async function createEventAction(formData: FormData) {
  // Require organizer authentication
  const currentUser = await requireOrganizer();

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
    organizerId: currentUser.userId,
    capacity: capacity, // undefined means unlimited
    description: description || undefined,
    coverImageUrl: imageUrl, // undefined means no image
  });

  // Add event to user's createdEvents array
  await User.findByIdAndUpdate(currentUser.userId, {
    $push: { createdEvents: newEvent._id },
  });

  redirect("/myEvents");
}

export async function updateEventAction(formData: FormData) {
  // Require organizer authentication
  const currentUser = await requireOrganizer();

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

  // Verify the user owns this event
  const event = await Event.findById(id);
  if (!event) {
    throw new Error("Event not found");
  }
  if (event.organizerId !== currentUser.userId) {
    throw new Error("You don't have permission to edit this event");
  }

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

  redirect("/myEvents");
}

export async function deleteEventAction(formData: FormData) {
  // Require organizer authentication
  const currentUser = await requireOrganizer();

  const id = formData.get("eventId") as string;

  if (!id) {
    throw new Error("Missing event ID");
  }

  await connectDb();

  // Verify the user owns this event
  const event = await Event.findById(id);
  if (!event) {
    throw new Error("Event not found");
  }
  if (event.organizerId !== currentUser.userId) {
    throw new Error("You don't have permission to delete this event");
  }

  // Delete the event
  await Event.findByIdAndDelete(id);

  // Clean up bookings for this event
  await Booking.deleteMany({ event: id });

  // Remove from user's createdEvents
  await User.findByIdAndUpdate(currentUser.userId, {
    $pull: { createdEvents: id },
  });

  redirect("/myEvents");
}

export async function bookEventAction(formData: FormData) {
  // Require authentication
  const currentUser = await requireAuth();

  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!eventId || !name || !email || !phone) {
    throw new Error("Missing required fields");
  }

  await connectDb();

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Check if user already booked this event
  const existingBooking = await Booking.findOne({
    user: currentUser.userId,
    event: eventId,
    status: { $ne: "cancelled" },
  });

  if (existingBooking) {
    throw new Error("You have already booked this event");
  }

  // Check capacity if event has one
  if (event.capacity) {
    const bookedCount = await Booking.countDocuments({
      event: eventId,
      status: { $ne: "cancelled" },
    });
    if (bookedCount >= event.capacity) {
      throw new Error("Event is fully booked");
    }
  }

  // Create booking
  await Booking.create({
    user: currentUser.userId,
    event: eventId,
    seats: 1,
    status: "confirmed",
    name,
    email,
    phone,
  });

  // Add event to user's bookedEvents array
  await User.findByIdAndUpdate(currentUser.userId, {
    $push: { bookedEvents: eventId },
  });

  redirect("/home?booked=true");
}

export async function cancelBookingAction(formData: FormData) {
  const currentUser = await requireAuth();
  const eventId = formData.get("eventId") as string;

  if (!eventId) {
    throw new Error("Missing event ID");
  }

  await connectDb();

  const booking = await Booking.findOne({
    user: currentUser.userId,
    event: eventId,
    status: { $ne: "cancelled" },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Update booking status to cancelled
  booking.status = "cancelled";
  await booking.save();

  // Remove from user's bookedEvents array
  await User.findByIdAndUpdate(currentUser.userId, {
    $pull: { bookedEvents: eventId },
  });

  redirect("/home?cancelled=true");
}
