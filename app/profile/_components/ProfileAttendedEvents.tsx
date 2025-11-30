import Image from 'next/image';

const MOCK_EVENTS = [
    {
        id: 1,
        title: "TechConf 2024",
        date: "Oct 15, 2024",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000",
        location: "Moscone Center"
    },
    {
        id: 2,
        title: "Summer Music Festival",
        date: "July 20, 2024",
        image: "https://images.unsplash.com/photo-1459749411177-287ce5dec183?auto=format&fit=crop&q=80&w=2000",
        location: "Golden Gate Park"
    },
    {
        id: 3,
        title: "AI Workshop",
        date: "Nov 05, 2024",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2000",
        location: "Innovation Hub"
    }
];

export default function ProfileAttendedEvents() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Attended Events</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_EVENTS.map((event) => (
                    <div key={event.id} className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="relative h-32 w-full">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-3">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">{event.title}</h3>
                            <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>{event.date}</span>
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
