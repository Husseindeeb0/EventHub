"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";

export default function GiveFeedbackButton({ eventId }: { eventId?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (eventId) {
            router.push(`/home/${eventId}?showFeedback=true`);
        } else {
            const params = new URLSearchParams(searchParams.toString());
            params.set("showFeedback", "true");
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    return (
        <button
            onClick={handleClick}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-6 py-3 text-sm font-semibold text-indigo-600 border border-indigo-200 shadow-sm transition-all hover:bg-indigo-100 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            <MessageSquarePlus className="w-5 h-5" />
            Give Feedback
        </button>
    );
}
