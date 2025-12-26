import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/serverAuth";
import LiveStreamClient from "./LiveStreamClient";

async function getEvent(id: string) {
  try {
    await connectDb();
    const event = await Event.findById(id).lean();
    if (!event) return null;
    return {
      _id: (event._id as any).toString(),
      title: event.title,
      category: event.category,
      description: event.description,
      liveStreamUrl: event.liveStreamUrl,
      organizerId: event.organizerId,
      schedule: event.schedule,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
    };
  } catch (error) {
    console.error("Database error in getEvent:", error);
    return null;
  }
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;

  // Handle standard watch URLs
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Handle youtu.be short URLs
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Handle embed URLs
  const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // Handle /live/ format
  const liveMatch = url.match(/\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];

  return null;
}

export default async function LiveStreamPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const event = await getEvent(resolvedParams.id);
  const currentUser = await getCurrentUser();

  if (!event || !event.liveStreamUrl) {
    notFound();
  }

  const youtubeId = getYouTubeId(event.liveStreamUrl);

  return (
    <LiveStreamClient
      event={{
        _id: event._id,
        title: event.title,
        category: event.category,
        description: event.description,
        liveStreamUrl: event.liveStreamUrl,
        organizerId: event.organizerId,
        schedule: event.schedule as any,
      }}
      youtubeId={youtubeId}
      currentUserId={currentUser?.userId}
    />
  );
}
