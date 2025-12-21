"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { requireOrganizer, requireAuth } from "@/lib/serverAuth";
import imagekit from "@/lib/imagekit";

export async function createEventAction(formData: FormData) {
  // Require organizer authentication
  const currentUser = await requireOrganizer();

  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const startsAt = formData.get("startsAt") as string;
  const endsAt = formData.get("endsAt") as string;
  const capacityStr = formData.get("capacity") as string;
  const description = formData.get("description") as string;
  const category = (formData.get("category") as string) || "Other";
  const coverImageUrl = formData.get("coverImageUrl") as string;
  const coverImageFileId = formData.get("coverImageFileId") as string;

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

  const imageFileId =
    coverImageFileId && coverImageFileId.trim() !== ""
      ? coverImageFileId.trim()
      : undefined;

  const newEvent = await Event.create({
    title,
    location,
    startsAt: new Date(startsAt),
    endsAt: endsAt ? new Date(endsAt) : undefined,
    organizerId: currentUser.userId,
    capacity: capacity, // undefined means unlimited
    category,
    description: description || undefined,
    coverImageUrl: imageUrl, // undefined means no image
    coverImageFileId: imageFileId,
  });

  // Add event to user's createdEvents array
  await User.findByIdAndUpdate(currentUser.userId, {
    $push: { createdEvents: newEvent._id },
  });

  revalidatePath("/myEvents");
  redirect("/myEvents");
}

export async function updateEventAction(formData: FormData) {
  console.log("updateEventAction started");
  try {
    // Require organizer authentication
    const currentUser = await requireOrganizer();
    console.log("User authorized:", currentUser.userId);

    const id = formData.get("eventId") as string;
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const startsAt = formData.get("startsAt") as string;
    const endsAt = formData.get("endsAt") as string;
    const capacityStr = formData.get("capacity") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const coverImageUrl = formData.get("coverImageUrl") as string;
    const coverImageFileId = formData.get("coverImageFileId") as string;

    console.log("Form data parsed:", { id, title, location });

    if (!id || !title || !location || !startsAt) {
      throw new Error("Missing required fields");
    }

    await connectDb();
    console.log("DB connected");

    // Verify the user owns this event
    const event = await Event.findById(id);
    if (!event) {
      throw new Error("Event not found");
    }
    if (event.organizerId !== currentUser.userId) {
      throw new Error("You don't have permission to edit this event");
    }
    console.log("Event found and owned");

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

    const imageFileId =
      coverImageFileId && coverImageFileId.trim() !== ""
        ? coverImageFileId.trim()
        : undefined;

    console.log("Addressing image changes...", {
      oldUrl: event.coverImageUrl,
      newUrl: imageUrl,
    });

    // Handle Cover Image Deletion/Replacement
    if (imageUrl !== event.coverImageUrl) {
      console.log("Image URL changed");
      if (event.coverImageFileId) {
        console.log("Attempting to delete old image:", event.coverImageFileId);
        try {
          await imagekit.deleteFile(event.coverImageFileId);
          console.log("Deleted old event cover:", event.coverImageFileId);
        } catch (error) {
          console.error("Failed to delete old event cover:", error);
        }
      }
    }

    await Event.findByIdAndUpdate(id, {
      title,
      location,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : undefined,
      capacity: capacity, // undefined means unlimited
      category: category || undefined,
      description: description || undefined,
      coverImageUrl: imageUrl, // undefined means no image
      coverImageFileId: imageFileId,
    });
    console.log("Event updated in DB");
  } catch (error) {
    console.error("Error in updateEventAction:", error);
    throw error;
  }

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

  // Delete cover image if exists
  if (event.coverImageFileId) {
    try {
      await imagekit.deleteFile(event.coverImageFileId);
      console.log("Deleted event cover:", event.coverImageFileId);
    } catch (error) {
      console.error("Failed to delete event cover:", error);
    }
  }

  // Delete the event
  await Event.findByIdAndDelete(id);

  // Clean up bookings for this event
  await Booking.deleteMany({ event: id });

  // Remove from user's createdEvents
  await User.findByIdAndUpdate(currentUser.userId, {
    $pull: { createdEvents: id },
  });

  revalidatePath("/myEvents");
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

  // Check if event has ended
  const now = new Date();
  if (event.endsAt && new Date(event.endsAt) < now) {
    throw new Error("This event has already finished");
  } else if (
    !event.endsAt &&
    event.startsAt &&
    new Date(event.startsAt) < now
  ) {
    throw new Error("This event has already started and cannot be booked");
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

  redirect(`/home/${eventId}?booked=true`);
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

  redirect(`/home/${eventId}?cancelled=true`);
}
