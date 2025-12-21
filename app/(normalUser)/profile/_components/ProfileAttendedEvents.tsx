"use client";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import { selectUser } from "@/redux/features/auth/authSlice";
import { useGetEventsQuery } from "@/redux/features/events/eventsApi";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProfileAttendedEvents() {
  const user = useAppSelector(selectUser);
  const { data, isLoading } = useGetEventsQuery(
    { ids: user?.attendedEvents || [] },
    { skip: !user?.attendedEvents?.length }
  );

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <Link
              href={`/events/${event.id}`}
              key={event.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow block"
            >
              <div className="relative h-32 w-full">
                <Image
                  src={event.coverImageUrl || "/event-cover.png"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 truncate">
                  {event.title}
                </h3>
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <span>
                    {new Date(event.startsAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="truncate max-w-[50%]">{event.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't attended any events yet.</p>
        </div>
      )}
    </div>
  );
}
