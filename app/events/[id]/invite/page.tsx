import Link from "next/link";

export default async function InvitePage({ 
    params 
}: { 
    params: Promise<{ id: string }> | { id: string } 
}) {
    // Handle params as either Promise or object (Next.js 16 compatibility)
    const resolvedParams = await Promise.resolve(params);
    const eventId = resolvedParams.id;

    return (
        <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gradient-to-br from-emerald-100/70 via-teal-100/60 via-cyan-100/70 to-blue-100/60 p-4 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none"></div>
            <div className="w-full max-w-md text-center relative z-10">
                <div className="mb-8">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30">
                        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Event Created!
                    </h1>
                    <p className="mt-3 text-lg text-slate-600">
                        Your event has been successfully created.
                    </p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white p-8 shadow-2xl shadow-purple-500/10">
                    <div className="h-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
                    <div className="pt-6">
                        <div className="flex flex-col gap-3">
                            <Link
                                href={`/events/${eventId}`}
                                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                View Event Details
                            </Link>
                            <Link
                                href="/myEvents"
                                className="inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
                            >
                                Back to My Events
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
