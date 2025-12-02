"use client";

import { bookEventAction } from "@/app/actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                </span>
            ) : (
                "Reserve Your Spot"
            )}
        </button>
    );
}

export default function BookingForm({ eventId }: { eventId: string }) {
    return (
        <form action={bookEventAction} className="space-y-4">
            <input type="hidden" name="eventId" value={eventId} />
            
            <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name
                </label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-2.5 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Enter your first name"
                />
            </div>

            <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name
                </label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full rounded-xl border-2 border-purple-100 bg-purple-50/50 px-4 py-2.5 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Enter your last name"
                />
            </div>

            <SubmitButton />
        </form>
    );
}

