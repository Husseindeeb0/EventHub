"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { requireOrganizer, requireAuth } from "@/lib/serverAuth";
import imagekit from "@/lib/imagekit";
import Review from "@/models/Review";
import mongoose from "mongoose";

export async function createEventAction(formData: FormData) {
  // Require organizer authentication
  const currentUser = await requireOrganizer();

  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const isOnline = formData.get("isOnline") === "on";
  const meetingLink = formData.get("meetingLink") as string;
  const startsAt = formData.get("startsAt") as string;
  const endsAt = formData.get("endsAt") as string;
  const capacityStr = formData.get("capacity") as string;
  const description = formData.get("description") as string;
  const category = (formData.get("category") as string) || "Other";
  const coverImageUrl = formData.get("coverImageUrl") as string;
  const coverImageFileId = formData.get("coverImageFileId") as string;
  const speakersStr = formData.get("speakers") as string;
  const scheduleStr = formData.get("schedule") as string;

  if (
    !title ||
    (!isOnline && !location) ||
    (isOnline && !meetingLink) ||
    !startsAt
  ) {
    throw new Error(
      isOnline
        ? "Meeting link is required for online events"
        : "Location is required for in-person events"
    );
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

  // Parse speakers and schedule
  const speakers = speakersStr ? JSON.parse(speakersStr) : [];
  const schedule = scheduleStr ? JSON.parse(scheduleStr) : [];

  const newEvent = await Event.create({
    title,
    location: isOnline ? "Online" : location,
    isOnline,
    meetingLink: isOnline ? meetingLink : undefined,
    startsAt: new Date(startsAt),
    endsAt: endsAt ? new Date(endsAt) : undefined,
    organizerId: currentUser.userId,
    capacity: capacity, // undefined means unlimited
    category,
    description: description || undefined,
    coverImageUrl: imageUrl, // undefined means no image
    coverImageFileId: imageFileId,
    speakers: speakers.length > 0 ? speakers : undefined,
    schedule: schedule.length > 0 ? schedule : undefined,
  });

  // Add event to user's createdEvents array
  await User.findByIdAndUpdate(currentUser.userId, {
    $push: { createdEvents: newEvent._id },
  });

  // Notify followers (in-app + email)
  try {
    // Find all users who follow this organizer
    const followers = await User.find({ following: currentUser.userId }).select(
      "_id name email"
    );

    if (followers.length > 0) {
      const organizer = await User.findById(currentUser.userId).select(
        "name imageUrl"
      );
      const organizerName = organizer?.name || "An organizer";
      const organizerImageUrl = organizer?.imageUrl;

      const { createNotification } = await import("@/lib/notifications");
      const { sendEmail } = await import("@/lib/sendEmail");
      const {
        generateNewEventEmailTemplate,
        formatEventDate,
        formatEventTime,
      } = await import("@/lib/emailTemplates");

      // Base URL for event links
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const eventUrl = `${baseUrl}/home/${newEvent._id}`;

      // Event date/time formatting
      const eventDate = formatEventDate(new Date(startsAt));
      const eventTime = formatEventTime(new Date(startsAt));

      // Process each follower
      for (const follower of followers) {
        // Create in-app notification
        await createNotification({
          recipient: follower._id.toString(),
          type: "NEW_EVENT_FROM_FOLLOWING",
          message: `${organizerName} posted a new event: "${title}"`,
          relatedEntityId: newEvent._id as any,
          relatedEntityType: "Event",
        });

        // Generate and send email notification
        const emailHtml = generateNewEventEmailTemplate({
          followerName: follower.name,
          organizerName,
          organizerImageUrl,
          eventTitle: title,
          eventDescription: description,
          eventLocation: isOnline ? "Online Event" : location,
          eventDate,
          eventTime,
          eventCategory: category,
          eventImageUrl: imageUrl,
          eventUrl,
        });

        // Send email (non-blocking)
        sendEmail({
          to: follower.email,
          subject: `🎉 New Event from ${organizerName}: ${title}`,
          html: emailHtml,
        }).catch((err) => {
          console.error(`Failed to send email to ${follower.email}:`, err);
        });
      }
    }
  } catch (error) {
    console.error("Failed to notify followers:", error);
  }

  revalidatePath("/myEvents");
  redirect("/myEvents");
}

export async function updateEventAction(formData: FormData) {
  try {
    // Require organizer authentication
    const currentUser = await requireOrganizer();

    const id = formData.get("eventId") as string;
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const isOnline = formData.get("isOnline") === "on";
    const meetingLink = formData.get("meetingLink") as string;
    const startsAt = formData.get("startsAt") as string;
    const endsAt = formData.get("endsAt") as string;
    const capacityStr = formData.get("capacity") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const coverImageUrl = formData.get("coverImageUrl") as string;
    const coverImageFileId = formData.get("coverImageFileId") as string;
    const speakersStr = formData.get("speakers") as string;
    const scheduleStr = formData.get("schedule") as string;

    if (
      !id ||
      !title ||
      (!isOnline && !location) ||
      (isOnline && !meetingLink) ||
      !startsAt
    ) {
      throw new Error(
        isOnline
          ? "Meeting link is required for online events"
          : "Location is required for in-person events"
      );
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

    const imageFileId =
      coverImageFileId && coverImageFileId.trim() !== ""
        ? coverImageFileId.trim()
        : undefined;

    // Handle Cover Image Deletion/Replacement
    if (imageUrl !== event.coverImageUrl) {
      if (event.coverImageFileId) {
        try {
          if (imagekit) {
            await imagekit.deleteFile(event.coverImageFileId);
          } else {
            console.warn("ImageKit not initialized - cannot delete file");
          }
        } catch (error) {
          console.error("Failed to delete old event cover:", error);
        }
      }
    }

    // Parse speakers and schedule
    const speakers = speakersStr ? JSON.parse(speakersStr) : [];
    const schedule = scheduleStr ? JSON.parse(scheduleStr) : [];

    await Event.findByIdAndUpdate(id, {
      title,
      location: isOnline ? "Online" : location,
      isOnline,
      meetingLink: isOnline ? meetingLink : undefined,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : undefined,
      capacity: capacity, // undefined means unlimited
      category: category || undefined,
      description: description || undefined,
      coverImageUrl: imageUrl, // undefined means no image
      coverImageFileId: imageFileId,
      speakers: speakers.length > 0 ? speakers : undefined,
      schedule: schedule.length > 0 ? schedule : undefined,
    });

    // Update attendedEvents for users based on new date
    const updatedEvent = await Event.findById(id);
    if (updatedEvent) {
      const now = new Date();
      const isFinished = updatedEvent.endsAt
        ? new Date(updatedEvent.endsAt) < now
        : updatedEvent.startsAt
        ? new Date(updatedEvent.startsAt) < now
        : false;

      const bookings = await Booking.find({
        event: id,
        status: "confirmed",
      }).select("user");

      const userIds = bookings.map((b) => b.user);

      if (userIds.length > 0) {
        if (isFinished) {
          await User.updateMany(
            { _id: { $in: userIds } },
            { $addToSet: { attendedEvents: id } }
          );
        } else {
          await User.updateMany(
            { _id: { $in: userIds } },
            { $pull: { attendedEvents: id } }
          );
        }
      }
    }
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
      if (imagekit) {
        await imagekit.deleteFile(event.coverImageFileId);
      } else {
        console.warn("ImageKit not initialized - cannot delete file");
      }
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

import Feedback from "@/models/Feedback";

// ... (existing imports)

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

  // Trigger Notification
  try {
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      recipient: currentUser.userId,
      type: "RESERVATION",
      message: `You successfully reserved a spot for "${event.title}"`,
      relatedEntityId: eventId,
      relatedEntityType: "Event",
    });
  } catch (error) {
    console.error("Failed to create reservation notification:", error);
  }

  // Check if this is the user's first successful booking
  // We count bookings. If it's 1, it's the first one (since we just created one).
  // AND check if they haven't given feedback yet.
  const successfulBookingsCount = await Booking.countDocuments({
    user: currentUser.userId,
    status: "confirmed",
  });

  let showFeedback = false;
  if (successfulBookingsCount === 1) {
    const existingFeedback = await Feedback.findOne({
      user: currentUser.userId,
    });
    if (!existingFeedback) {
      showFeedback = true;
    }
  }

  redirect(
    `/home/${eventId}?booked=true${showFeedback ? "&showFeedback=true" : ""}`
  );
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
  }).populate("event");

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

  // Trigger Notification
  try {
    const { createNotification } = await import("@/lib/notifications");
    const eventTitle = (booking.event as any)?.title || "Event";
    const relatedEntityId = (booking.event as any)?._id || eventId;

    await createNotification({
      recipient: currentUser.userId,
      type: "CANCELLATION",
      message: `You successfully cancelled your reservation for "${eventTitle}"`,
      relatedEntityId: relatedEntityId,
      relatedEntityType: "Event",
    });
  } catch (error) {
    console.error("Failed to create cancellation notification:", error);
  }

  redirect(`/home/${eventId}?cancelled=true`);
}

export async function rateEventAction(formData: FormData) {
  const currentUser = await requireAuth();
  const eventId = formData.get("eventId") as string;
  const ratingStr = formData.get("rating") as string;

  if (!eventId || !ratingStr) {
    throw new Error("Missing required fields");
  }

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("Invalid rating");
  }

  await connectDb();

  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  const now = new Date();
  const isFinished = event.endsAt
    ? new Date(event.endsAt) < now
    : event.startsAt
    ? new Date(event.startsAt) < now
    : false;

  if (!isFinished) {
    throw new Error("You can only rate finished events");
  }

  // Check if user has already rated
  const existingReview = await Review.findOne({
    user: currentUser.userId,
    event: eventId,
  });

  if (existingReview) {
    throw new Error("You have already rated this event");
  }

  // Create Review
  await Review.create({
    user: currentUser.userId,
    event: eventId,
    rating,
  });

  // Calculate new average
  const result = await Review.aggregate([
    { $match: { event: new mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avgRating = result[0]?.avgRating || 0;
  const count = result[0]?.count || 0;

  // Update Event
  await Event.findByIdAndUpdate(eventId, {
    averageRating: avgRating,
    ratingCount: count,
  });

  revalidatePath("/bookings");
  revalidatePath(`/home/${eventId}`);
}
