"use client";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/features/auth/authSlice";
import { useGetEventsQuery } from "@/redux/features/events/eventsApi";
import { Loader2, Clock, MapPin, Star } from "lucide-react";
import Link from "next/link";
import RatingModal from "@/components/ui/RatingModal";
import { useState } from "react";

export default function ProfileAttendedEvents() {
  const user = useAppSelector(selectUser);
  const { data, isLoading } = useGetEventsQuery(
    { ids: user?.attendedEvents || [] },
    { skip: !user?.attendedEvents?.length }
  );

  const [selectedEventForRating, setSelectedEventForRating] = useState<
    any | null
  >(null);

  const events = data?.events || [];

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Attended Events
      </h2>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="relative">
              <Link
                href={`/home/${event.id}`}
                className="group relative flex gap-4 p-3 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={event.coverImageUrl || "/event-cover.png"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h3 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest border border-slate-100">
                      {event.category || "Other"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {event.startsAt
                        ? new Date(event.startsAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "TBA"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      <MapPin className="w-3 h-3 text-purple-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedEventForRating(event);
                }}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 shadow-sm hover:bg-amber-50 text-slate-400 hover:text-amber-500 transition-all border border-slate-100"
                title="Rate Event"
              >
                <Star className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't attended any events yet.</p>
        </div>
      )}

      <RatingModal
        isOpen={!!selectedEventForRating}
        onClose={() => setSelectedEventForRating(null)}
        eventId={selectedEventForRating?.id || ""}
        eventTitle={selectedEventForRating?.title || ""}
      />
    </div>
  );
}
