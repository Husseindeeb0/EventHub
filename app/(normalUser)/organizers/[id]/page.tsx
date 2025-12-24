import { notFound } from "next/navigation";
import Image from "next/image";
import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/serverAuth";
import FollowButton from "@/components/follow/FollowButton";
import Link from "next/link";
import {
  Building2,
  Users,
  Settings,
  Calendar,
  MapPin,
  Star,
} from "lucide-react";
import Event from "@/models/Event";
import {
  AnimatedPageHeader,
  AnimatedCard,
} from "@/components/animations/PageAnimations";

async function getOrganizerProfile(id: string) {
  try {
    await connectDb();
    const organizer = await User.findById(id)
      .select("name email imageUrl coverImageUrl description role followers")
      .lean();
    return organizer ? JSON.parse(JSON.stringify(organizer)) : null;
  } catch (error) {
    console.error("Error fetching organizer:", error);
    return null;
  }
}

async function getOrganizerEvents(organizerId: string) {
  try {
    await connectDb();
    const events = await Event.find({ organizerId })
      .sort({ startsAt: 1 }) // Closest dates first
      .lean();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error(
      "Error fetching organizer events:",
      JSON.stringify(error, null, 2)
    );
    return [];
  }
}

export default async function OrganizerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const organizer = await getOrganizerProfile(resolvedParams.id);
  const events = await getOrganizerEvents(resolvedParams.id);
  const currentUser = await getCurrentUser();

  if (!organizer) {
    notFound();
  }

  // Calculate Overall Rating
  let totalScore = 0;
  let totalRatings = 0;

  events.forEach((event: any) => {
    if (event.ratingCount && event.ratingCount > 0) {
      totalScore += (event.averageRating || 0) * event.ratingCount;
      totalRatings += event.ratingCount;
    }
  });

  const overallRating =
    totalRatings > 0 ? (totalScore / totalRatings).toFixed(1) : null;

  const isFollowing = currentUser
    ? organizer.followers.includes(currentUser.userId)
    : false;

  return (
    <main className="min-h-[calc(100vh-56px)] bg-slate-50 pb-12">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full bg-slate-900 overflow-hidden">
        {organizer.coverImageUrl ? (
          <Image
            src={organizer.coverImageUrl}
            alt="Cover"
            fill
            className="object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-r from-indigo-900 to-purple-900 opacity-90" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <AnimatedPageHeader>
          <div className="flex flex-col md:flex-row items-end md:items-center gap-6 mb-8">
            {/* Profile Picture */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                {organizer.imageUrl ? (
                  <Image
                    src={organizer.imageUrl}
                    alt={organizer.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-500">
                    {organizer.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-white md:text-slate-900 md:pt-20">
              <h1 className="text-3xl font-black tracking-tight drop-shadow-lg md:drop-shadow-none mb-2">
                {organizer.name}
              </h1>
              <div className="flex flex-wrap text-white/90 md:text-slate-500 font-medium gap-4">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>
                    {organizer.role === "organizer" ? "Organization" : "User"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{organizer.followers.length} Followers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star
                    className={`w-4 h-4 ${
                      overallRating
                        ? "text-amber-500 fill-amber-500"
                        : "text-slate-400"
                    }`}
                  />
                  <span>
                    {overallRating
                      ? `${overallRating} Overall Rating`
                      : "No Ratings yet"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="md:pt-20">
              {currentUser && currentUser.userId === organizer._id ? (
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Link>
              ) : currentUser ? (
                <FollowButton
                  organizerId={organizer._id}
                  initialIsFollowing={isFollowing}
                  initialFollowerCount={organizer.followers.length}
                  className="text-sm! px-6! py-2.5! shadow-lg shadow-indigo-500/20"
                />
              ) : null}
            </div>
          </div>
        </AnimatedPageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatedCard delay={0.2}>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  About {organizer.name}
                </h2>
                {organizer.description ? (
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {organizer.description}
                  </p>
                ) : (
                  <p className="text-slate-400 italic">
                    No description provided.
                  </p>
                )}
              </div>
            </AnimatedCard>

            {/* Events Section */}
            <AnimatedCard delay={0.3}>
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 px-1">
                  Events by {organizer.name}
                  <span className="bg-indigo-100 text-indigo-600 text-xs py-1 px-3 rounded-full ml-auto">
                    {events.length} Events
                  </span>
                </h2>

                {events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map((event: any) => (
                      <Link
                        key={event._id}
                        href={`/home/${event._id}`}
                        className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-indigo-100 transition-all duration-300"
                      >
                        {/* Card Image */}
                        <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                          {event.coverImageUrl ? (
                            <Image
                              src={event.coverImageUrl}
                              alt={event.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-indigo-50 text-indigo-300">
                              <Calendar className="w-10 h-10 opacity-50" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-sm">
                              {event.title}
                            </h3>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                            <span>
                              {event.startsAt
                                ? new Date(event.startsAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )
                                : "Date TBA"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                            <span className="truncate">
                              {event.location || "Location TBA"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No events created yet.</p>
                  </div>
                )}
              </div>
            </AnimatedCard>
          </div>

          {/* Sidebar - Stats or Contact? */}
          <div className="lg:col-span-1">
            {/* Placeholder for future stats or contact info */}
            <AnimatedCard delay={0.4}>
              <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-50 sticky top-24">
                <p className="text-center text-indigo-900/60 text-sm font-medium">
                  More info coming soon...
                </p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </main>
  );
}
