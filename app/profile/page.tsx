import ProfileHeader from "./_components/ProfileHeader";
import ProfileInfo from "./_components/ProfileInfo";
import ProfileAttendedEvents from "./_components/ProfileAttendedEvents";

export default function ProfilePage() {
    return (
        <div
            className="min-h-screen bg-black relative"
            style={{
                backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(80, 40, 120, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(40, 80, 180, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 20px 20px, rgba(50, 50, 60, 0.3) 1.5px, transparent 1.5px),
          radial-gradient(circle at 60px 60px, rgba(50, 50, 60, 0.25) 1.5px, transparent 1.5px),
          linear-gradient(135deg, 
            transparent 0%, 
            transparent 48%, 
            rgba(40, 40, 50, 0.15) 49%, 
            rgba(40, 40, 50, 0.15) 51%, 
            transparent 52%, 
            transparent 100%
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 100px,
            rgba(45, 45, 55, 0.12) 100px,
            rgba(45, 45, 55, 0.12) 102px
          )
        `,
                backgroundSize: '200% 200%, 200% 200%, 80px 80px, 80px 80px, 50px 50px, 100px 100px',
                backgroundPosition: '0 0, 100% 100%, 0 0, 40px 40px, 0 0, 0 0'
            }}
        >
            {/* Sophisticated overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-950/5 via-transparent to-blue-950/5 pointer-events-none"></div>

            <div className="relative max-w-5xl mx-auto px-4 py-8">
                <ProfileHeader />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Info */}
                    <div className="lg:col-span-1">
                        <ProfileInfo />
                    </div>

                    {/* Right Column - Events */}
                    <div className="lg:col-span-2">
                        <ProfileAttendedEvents />
                    </div>
                </div>
            </div>
        </div>
    );
}
