import { api } from "../../api";
import { Event } from "../events/eventsApi";

export interface Booking {
  _id: string;
  eventId: string;
  title: string;
  location: string;
  startsAt: string;
  endsAt?: string;
  coverImageUrl?: string;
  capacity?: number;
  description?: string;
  numberOfSeats: number;
  bookedAt: string;
  averageRating?: number;
  ratingCount?: number;
  userRating: number | null;
  name?: string;
  email?: string;
  phone?: string;
  userId?: string;
  organizer?: {
    _id: string;
    name: string;
    email: string;
    imageUrl?: string;
  } | null;
}

export const bookingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<
      { success: boolean; bookings: Booking[]; hasGivenFeedback: boolean },
      void
    >({
      query: () => "/bookings",
      providesTags: ["Booking"],
    }),
    bookEvent: builder.mutation<
      any,
      {
        eventId: string;
        name: string;
        email: string;
        phone: string;
        seats?: number;
      }
    >({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking", "Event"],
    }),
    cancelBooking: builder.mutation<any, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking", "Event"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useBookEventMutation,
  useCancelBookingMutation,
} = bookingsApi;
