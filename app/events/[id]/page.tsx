import connectDb from "@/lib/connectDb";
import Event from "@/models/Event";
import User from "@/models/User";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";
import { AnimatedHero, AnimatedContent, AnimatedCard, AnimatedSuccessMessage } from "./AnimatedEventContent";

async function getEvent(id: string) {
    await connectDb();
    try {
        const event = await Event.findById(id).lean();
        if (!event) return null;
        return { ...event, _id: event._id.toString() };
    } catch (error) {
        return null;
    }
}

async function getBookedCount(eventId: string) {
    await connectDb();
    try {
        return await User.countDocuments({ eventId });
    } catch (error) {
        return 0;
    }
}

function formatEventDate(date: any): string {
    if (!date) return "Date TBA";
    
    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) {
            return "Date TBA";
        }
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }).format(dateObj);
    } catch (error) {
        return "Date TBA";
    }
}

export default async function EventDetailsPage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ id: string }> | { id: string };
    searchParams: Promise<{ booked?: string }> | { booked?: string };
}) {
    const resolvedParams = await Promise.resolve(params);
    const resolvedSearchParams = await Promise.resolve(searchParams);
    const event = await getEvent(resolvedParams.id);

    if (!event) {
        notFound();
    }

    const bookedCount = await getBookedCount(resolvedParams.id);
    const remainingSeats = event.capacity ? event.capacity - bookedCount : null;
    const isFull = event.capacity ? bookedCount >= event.capacity : false;

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-100/70 via-purple-100/80 via-blue-100/90 to-cyan-100/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none"></div>
            {/* Hero Section */}
            <AnimatedHero>
                <div className="relative h-[500px] w-full overflow-hidden bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200">
                {event.coverImageUrl ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={event.coverImageUrl}
                            alt={event.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                // Hide image on error to show clean gradient background
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="h-20 w-20 mx-auto text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-lg font-semibold text-purple-700">No Cover Image</p>
                        </div>
                    </div>
                )}
                {event.coverImageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-800/70 to-transparent"></div>
                )}
                <div className="absolute inset-0 flex items-end p-8 sm:p-12">
                    <div className="mx-auto w-full max-w-5xl">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                            {event.title}
                        </h1>
                        <div className="mt-6 flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">
                                    {formatEventDate(event.startsAt)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-medium">{event.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </AnimatedHero>

                <AnimatedContent>
                <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
                {/* Success Message */}
                {resolvedSearchParams?.booked === "true" && (
                    <AnimatedSuccessMessage>
                        <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Booking Confirmed!</h3>
                                <p className="text-sm text-white/90">You've successfully booked a spot for this event.</p>
                            </div>
                        </div>
                        </div>
                    </AnimatedSuccessMessage>
                )}

                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <AnimatedCard delay={0.4}>
                            <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-lg">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                                About this event
                            </h2>
                            {event.description ? (
                                <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line">
                                    {event.description}
                                </p>
                            ) : (
                                <p className="text-lg leading-relaxed text-slate-500 italic">
                                    No description provided for this event.
                                </p>
                            )}
                            </div>
                        </AnimatedCard>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <AnimatedCard delay={0.6}>
                            <div className="sticky top-24 rounded-3xl border border-purple-100 bg-white p-6 shadow-xl">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Book Your Spot</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center pb-3 border-b border-purple-100">
                                    <span className="text-sm font-medium text-slate-600">Price</span>
                                    <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Free</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600">Bookings</span>
                                    <span className={`text-lg font-bold ${isFull ? 'text-red-600' : 'text-slate-900'}`}>
                                        {event.capacity != null 
                                            ? `${bookedCount} / ${event.capacity}` 
                                            : `${bookedCount}`}
                                    </span>
                                </div>
                            </div>

                            {isFull ? (
                                <div className="rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 text-red-700 font-semibold">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span>Event is Full</span>
                                    </div>
                                </div>
                            ) : (
                                <BookingForm eventId={resolvedParams.id} />
                            )}
                            </div>
                        </AnimatedCard>
                    </div>
                </div>
                </div>
            </AnimatedContent>
        </main>
    );
}


