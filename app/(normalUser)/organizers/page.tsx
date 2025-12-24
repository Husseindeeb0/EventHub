import connectDb from "@/lib/connectDb";
import User from "@/models/User";
import Event from "@/models/Event";
import { getCurrentUser } from "@/lib/serverAuth";
import { AnimatedPageHeader } from "@/components/animations/PageAnimations";
import OrganizersList from "@/components/organizers/OrganizersList";

async function getOrganizersWithStats() {
  try {
    await connectDb();

    // 1. Get all organizers
    const organizers = await User.find({ role: "organizer" })
      .select("name email imageUrl description followers")
      .lean();

    // 2. For each organizer, fetch their events to calculate stats
    // Note: In a production app with many organizers, you'd use an aggregation pipeline
    // or store these stats on the User model.
    const organizersWithStats = await Promise.all(
      organizers.map(async (org: any) => {
        const orgEvents = await Event.find({ organizerId: org._id.toString() })
          .select("averageRating ratingCount")
          .lean();

        let totalScore = 0;
        let totalRatings = 0;

        orgEvents.forEach((ev: any) => {
          if (ev.ratingCount && ev.ratingCount > 0) {
            totalScore += (ev.averageRating || 0) * ev.ratingCount;
            totalRatings += ev.ratingCount;
          }
        });

        return {
          ...JSON.parse(JSON.stringify(org)),
          averageRating: totalRatings > 0 ? totalScore / totalRatings : 0,
          eventCount: orgEvents.length,
        };
      })
    );

    return organizersWithStats;
  } catch (error) {
    console.error("Error fetching organizers with stats:", error);
    return [];
  }
}

export default async function OrganizersPage() {
  const organizers = await getOrganizersWithStats();
  const currentUser = await getCurrentUser();

  return (
    <main className="min-h-[calc(100vh-56px)] bg-slate-50 relative overflow-hidden pb-20">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-linear-to-b from-indigo-50/50 to-transparent -z-10" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 relative z-10">
        <AnimatedPageHeader>
          <header className="relative mb-12 text-center sm:text-left">
            <div className="flex flex-col gap-3 relative z-10">
              <span className="inline-flex w-fit mx-auto sm:mx-0 items-center rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-600 border border-indigo-100">
                Community Leaders
              </span>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl leading-tight">
                Featured Organizers
              </h1>
              <p className="text-sm sm:text-lg text-slate-500 font-medium max-w-2xl">
                Discover the brilliant minds behind your favorite events and
                stay updated with their latest experiences.
              </p>
            </div>
          </header>
        </AnimatedPageHeader>

        <OrganizersList
          initialOrganizers={organizers}
          currentUser={currentUser}
        />
      </div>
    </main>
  );
}
