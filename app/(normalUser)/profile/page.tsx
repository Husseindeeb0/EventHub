import AnimatedPageHeader from "@/components/animations/AnimatedPageHeader";
import { AnimatedCard } from "@/components/animations/PageAnimations";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileInfo from "./_components/ProfileInfo";
import ProfileAttendedEvents from "./_components/ProfileAttendedEvents";

export default function ProfilePage() {
    return (
        <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-100 via-indigo-100/60 via-purple-100/70 to-blue-100/80 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.2),transparent_60%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.2),transparent_60%)] pointer-events-none"></div>
            
            <div className="relative max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 z-10">
                <AnimatedPageHeader>
                    <ProfileHeader />
                </AnimatedPageHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Info */}
                    <div className="lg:col-span-1">
                        <AnimatedCard delay={0.2}>
                            <ProfileInfo />
                        </AnimatedCard>
                    </div>

                    {/* Right Column - Events */}
                    <div className="lg:col-span-2">
                        <AnimatedCard delay={0.3}>
                            <ProfileAttendedEvents />
                        </AnimatedCard>
                    </div>
                </div>
            </div>
        </main>
    );
}
