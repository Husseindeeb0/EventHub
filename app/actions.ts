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
import Feedback from "@/models/Feedback";

export async function createEventAction(formData: FormData) {
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
  const isPaid = formData.get("isPaid") === "on";
  const priceStr = formData.get("price") as string;
  const whishNumber = formData.get("whishNumber") as string;
  const liveStreamUrl = formData.get("liveStreamUrl") as string;

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

  const capacity =
    capacityStr && capacityStr.trim() !== ""
      ? parseInt(capacityStr, 10)
      : undefined;

  if (capacity !== undefined && (isNaN(capacity) || capacity < 1)) {
    throw new Error("Capacity must be a positive number");
  }

  const imageUrl =
    coverImageUrl && coverImageUrl.trim() !== ""
      ? coverImageUrl.trim()
      : undefined;

  const imageFileId =
    coverImageFileId && coverImageFileId.trim() !== ""
      ? coverImageFileId.trim()
      : undefined;

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
    capacity: capacity,
    category,
    description: description || undefined,
    coverImageUrl: imageUrl,
    coverImageFileId: imageFileId,
    speakers: speakers.length > 0 ? speakers : undefined,
    schedule: schedule.length > 0 ? schedule : undefined,
    isPaid,
    price: isPaid ? parseFloat(priceStr) || 0 : 0,
    whishNumber: isPaid ? whishNumber : undefined,
    liveStreamUrl: liveStreamUrl || undefined,
  });

  await User.findByIdAndUpdate(currentUser.userId, {
    $push: { createdEvents: newEvent._id },
  });

  try {
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

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const eventUrl = `${baseUrl}/home/${newEvent._id}`;

      const eventDate = formatEventDate(new Date(startsAt));
      const eventTime = formatEventTime(new Date(startsAt));

      for (const follower of followers) {
        await createNotification({
          recipient: follower._id.toString(),
          type: "NEW_EVENT_FROM_FOLLOWING",
          message: `${organizerName} posted a new event: "${title}"`,
          relatedEntityId: newEvent._id as any,
          relatedEntityType: "Event",
        });

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
  revalidatePath("/");
  redirect("/myEvents");
}

export async function updateEventAction(formData: FormData) {
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
  const isPaid = formData.get("isPaid") === "on";
  const priceStr = formData.get("price") as string;
  const whishNumber = formData.get("whishNumber") as string;
  const liveStreamUrl = formData.get("liveStreamUrl") as string;

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

  const event = await Event.findById(id);
  if (!event) {
    throw new Error("Event not found");
  }
  if (event.organizerId !== currentUser.userId) {
    throw new Error("You don't have permission to edit this event");
  }

  const capacity =
    capacityStr && capacityStr.trim() !== ""
      ? parseInt(capacityStr, 10)
      : undefined;

  if (capacity !== undefined && (isNaN(capacity) || capacity < 1)) {
    throw new Error("Capacity must be a positive number");
  }

  const imageUrl =
    coverImageUrl && coverImageUrl.trim() !== ""
      ? coverImageUrl.trim()
      : undefined;

  const imageFileId =
    coverImageFileId && coverImageFileId.trim() !== ""
      ? coverImageFileId.trim()
      : undefined;

  if (imageUrl !== event.coverImageUrl) {
    if (event.coverImageFileId) {
      try {
        if (imagekit) {
          await imagekit.deleteFile(event.coverImageFileId);
        }
      } catch (error) {
        console.error("Failed to delete old event cover:", error);
      }
    }
  }

  const speakers = speakersStr ? JSON.parse(speakersStr) : [];
  const schedule = scheduleStr ? JSON.parse(scheduleStr) : [];

  await Event.findByIdAndUpdate(id, {
    title,
    location: isOnline ? "Online" : location,
    isOnline,
    meetingLink: isOnline ? meetingLink : undefined,
    startsAt: new Date(startsAt),
    endsAt: endsAt ? new Date(endsAt) : undefined,
    capacity: capacity,
    category: category || undefined,
    description: description || undefined,
    coverImageUrl: imageUrl,
    coverImageFileId: imageFileId,
    speakers: speakers.length > 0 ? speakers : undefined,
    schedule: schedule.length > 0 ? schedule : undefined,
    isPaid,
    price: isPaid ? parseFloat(priceStr) || 0 : 0,
    whishNumber: isPaid ? whishNumber : undefined,
    liveStreamUrl: liveStreamUrl || undefined,
  });

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

  revalidatePath("/myEvents");
  revalidatePath(`/home/${id}`);
  revalidatePath(`/home/${id}/edit`);
  revalidatePath("/");
  redirect("/myEvents");
}

export async function deleteEventAction(formData: FormData) {
  const currentUser = await requireOrganizer();
  const id = formData.get("eventId") as string;

  if (!id) throw new Error("Missing event ID");

  await connectDb();

  const event = await Event.findById(id);
  if (!event) throw new Error("Event not found");
  if (event.organizerId !== currentUser.userId) {
    throw new Error("You don't have permission to delete this event");
  }

  if (event.coverImageFileId) {
    try {
      if (imagekit) await imagekit.deleteFile(event.coverImageFileId);
    } catch (error) {
      console.error("Failed to delete event cover:", error);
    }
  }

  await Event.findByIdAndDelete(id);
  await Booking.deleteMany({ event: id });
  await User.findByIdAndUpdate(currentUser.userId, {
    $pull: { createdEvents: id },
  });

  revalidatePath("/myEvents");
  revalidatePath("/");
  redirect("/myEvents");
}

export async function bookEventAction(formData: FormData) {
  const currentUser = await requireAuth();
  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!eventId || !name || !email || !phone)
    throw new Error("Missing required fields");

  await connectDb();

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  const now = new Date();
  if (event.endsAt && new Date(event.endsAt) < now)
    throw new Error("This event has already finished");
  else if (!event.endsAt && event.startsAt && new Date(event.startsAt) < now)
    throw new Error("This event has already started");

  const existingBooking = await Booking.findOne({
    user: currentUser.userId,
    event: eventId,
    status: { $ne: "cancelled" },
  });

  if (existingBooking) throw new Error("You have already booked this event");

  if (event.capacity) {
    const bookedCount = await Booking.countDocuments({
      event: eventId,
      status: { $ne: "cancelled" },
    });
    if (bookedCount >= event.capacity) throw new Error("Event is fully booked");
  }

  await Booking.create({
    user: currentUser.userId,
    event: eventId,
    seats: 1,
    status: "confirmed",
    name,
    email,
    phone,
  });

  await User.findByIdAndUpdate(currentUser.userId, {
    $push: { bookedEvents: eventId },
  });

  try {
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      recipient: currentUser.userId,
      type: "RESERVATION",
      message: `You successfully reserved a spot for "${event.title}"`,
      relatedEntityId: eventId,
      relatedEntityType: "Event",
    });
  } catch (error) {}

  const successfulBookingsCount = await Booking.countDocuments({
    user: currentUser.userId,
    status: "confirmed",
  });

  let showFeedback = false;
  if (successfulBookingsCount === 1) {
    const existingFeedback = await Feedback.findOne({
      user: currentUser.userId,
    });
    if (!existingFeedback) showFeedback = true;
  }

  revalidatePath(`/home/${eventId}`);
  revalidatePath("/bookings");
  redirect(
    `/home/${eventId}?booked=true${showFeedback ? "&showFeedback=true" : ""}`
  );
}

export async function cancelBookingAction(formData: FormData) {
  const currentUser = await requireAuth();
  const eventId = formData.get("eventId") as string;

  if (!eventId) throw new Error("Missing event ID");

  await connectDb();

  const booking = await Booking.findOne({
    user: currentUser.userId,
    event: eventId,
    status: { $ne: "cancelled" },
  }).populate("event");

  if (!booking) throw new Error("Booking not found");

  booking.status = "cancelled";
  await booking.save();

  await User.findByIdAndUpdate(currentUser.userId, {
    $pull: { bookedEvents: eventId },
  });

  try {
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      recipient: currentUser.userId,
      type: "CANCELLATION",
      message: `You successfully cancelled your reservation for "${
        (booking.event as any)?.title || "Event"
      }"`,
      relatedEntityId: eventId,
      relatedEntityType: "Event",
    });
  } catch (error) {}

  revalidatePath(`/home/${eventId}`);
  revalidatePath("/bookings");
  redirect(`/home/${eventId}?cancelled=true`);
}

export async function rateEventAction(formData: FormData) {
  const currentUser = await requireAuth();
  const eventId = formData.get("eventId") as string;
  const ratingStr = formData.get("rating") as string;

  if (!eventId || !ratingStr) throw new Error("Missing required fields");

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5)
    throw new Error("Invalid rating");

  await connectDb();

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  const now = new Date();
  const isFinished = event.endsAt
    ? new Date(event.endsAt) < now
    : event.startsAt
    ? new Date(event.startsAt) < now
    : false;

  if (!isFinished) throw new Error("You can only rate finished events");

  const existingReview = await Review.findOne({
    user: currentUser.userId,
    event: eventId,
  });
  if (existingReview) throw new Error("You have already rated this event");

  await Review.create({ user: currentUser.userId, event: eventId, rating });

  const result = await Review.aggregate([
    { $match: { event: new mongoose.Types.ObjectId(eventId) } },
    {
      $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } },
    },
  ]);

  await Event.findByIdAndUpdate(eventId, {
    averageRating: result[0]?.avgRating || 0,
    ratingCount: result[0]?.count || 0,
  });

  revalidatePath("/bookings");
  revalidatePath(`/home/${eventId}`);
}

export async function approveBookingAction(requestId: string) {
  const currentUser = await requireOrganizer();
  await connectDb();

  const booking = await Booking.findById(requestId).populate("event");
  if (!booking) throw new Error("Booking request not found");

  const event = booking.event as any;
  if (event.organizerId !== currentUser.userId) throw new Error("Unauthorized");

  booking.status = "confirmed";
  await booking.save();

  await User.findByIdAndUpdate(booking.user, {
    $addToSet: { bookedEvents: event._id },
  });

  const { createNotification } = await import("@/lib/notifications");
  await createNotification({
    recipient: booking.user.toString(),
    type: "RESERVATION",
    message: `Your booking request for "${event.title}" has been approved!`,
    relatedEntityId: event._id.toString(),
    relatedEntityType: "Event",
  });

  try {
    const { sendEmail } = await import("@/lib/sendEmail");
    const user = await User.findById(booking.user).select("email name");
    if (user) {
      await sendEmail({
        to: user.email,
        subject: `✅ Booking Approved: ${event.title}`,
        html: `<p>Hello ${user.name || "there"}, Your booking for <strong>${
          event.title
        }</strong> has been approved!</p>`,
      });
    }
  } catch (emailErr) {}

  revalidatePath("/requests");
  return { success: true };
}

export async function rejectBookingAction(requestId: string) {
  const currentUser = await requireOrganizer();
  await connectDb();

  const booking = await Booking.findById(requestId).populate("event");
  if (!booking) throw new Error("Booking request not found");

  const event = booking.event as any;
  if (event.organizerId !== currentUser.userId) throw new Error("Unauthorized");

  booking.status = "rejected";
  await booking.save();

  if (event.capacity) {
    await Event.findByIdAndUpdate(event._id, {
      $inc: { availableSeats: booking.seats },
    });
  }

  const { createNotification } = await import("@/lib/notifications");
  await createNotification({
    recipient: booking.user.toString(),
    type: "CANCELLATION",
    message: `Your booking request for "${event.title}" was not approved.`,
    relatedEntityId: event._id.toString(),
    relatedEntityType: "Event",
  });

  try {
    const { sendEmail } = await import("@/lib/sendEmail");
    const user = await User.findById(booking.user).select("email name");
    if (user) {
      await sendEmail({
        to: user.email,
        subject: `❌ Booking Request Not Approved: ${event.title}`,
        html: `<p>Hello ${
          user.name || "there"
        }, Your booking request for <strong>${
          event.title
        }</strong> was not approved.</p>`,
      });
    }
  } catch (emailErr) {}

  revalidatePath("/requests");
  return { success: true };
}
