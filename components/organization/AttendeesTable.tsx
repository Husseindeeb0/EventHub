// src/app/events/[id]/components/EventAttendeesList.tsx (Client Component - UI Shape)

'use client';

import React from 'react';
import { User, Users } from 'lucide-react';
// Assuming the EventAttendee type is available globally or imported
interface EventAttendee {
    userId: string;
    userName: string;
    userEmail: string;
    seatsBooked: number;
}

// ---------------------------------------------------------------------
// MOCK DATA (Replaces fetching logic for UI shape)
// ---------------------------------------------------------------------
const MOCK_ATTENDEES: EventAttendee[] = [
    { userId: 'user-001', userName: 'Alice Johnson', userEmail: 'alice.j@example.com', seatsBooked: 2 },
    { userId: 'user-002', userName: 'Bob Smith', userEmail: 'bob.s@example.com', seatsBooked: 1 },
    { userId: 'user-003', userName: 'Charlie Brown', userEmail: 'charlie.b@example.com', seatsBooked: 4 },
];

interface EventAttendeesListProps {
    // We keep eventId as a prop, even though we use mock data, 
    // to maintain the expected component signature for later integration.
    eventId: string;
}

const EventAttendeesList: React.FC<EventAttendeesListProps> = ({ eventId }) => {

    const attendees = MOCK_ATTENDEES;

    // Calculate total seats booked from mock data
    const totalSeatsBooked = attendees.reduce((sum, attendee) => sum + attendee.seatsBooked, 0);

    // --- UI Layout ---
    return (
        <div className="mt-8 p-6 bg-white shadow-xl rounded-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-indigo-600" />
                Attendee Bookings Report
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                Overview of all users who have booked seats for this event (ID: **{eventId}**).
            </p>

            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <span className="text-lg font-semibold text-gray-700">Total Users Booked: {attendees.length}</span>
                <span className="text-xl font-bold text-indigo-700 bg-indigo-50 p-2 rounded-lg">
                    {totalSeatsBooked} Seats Total
                </span>
            </div>

            {/* List Display */}
            {attendees.length === 0 ? (
                <div className="p-6 text-center bg-gray-50 rounded-lg">
                    <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 italic">No users have booked seats for this event yet.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {attendees.map((attendee) => (
                        <li
                            key={attendee.userId}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white hover:bg-indigo-50 transition duration-150 rounded-lg border border-gray-200"
                        >
                            {/* User Info */}
                            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                <div className="p-2 bg-indigo-100 rounded-full">
                                    <User className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800">{attendee.userName}</span>
                                    <span className="text-sm text-gray-500">{attendee.userEmail}</span>
                                </div>
                            </div>

                            {/* Seats Count */}
                            <div className="text-right">
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold shadow-sm">
                                    {attendee.seatsBooked} {attendee.seatsBooked > 1 ? 'Seats' : 'Seat'} Booked
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EventAttendeesList;

// Example: app/(organizer)/events/attendees/page.tsx

const EventAttendeesPage = () => {
    return (
        <div>
            {/* ... Content ... */}
        </div>
    );
};

// 🔑 Must be the default export
export default EventAttendeesPage;