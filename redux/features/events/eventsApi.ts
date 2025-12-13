import { api } from "../../api";

export interface Event {
  id: string;
  title: string;
  location: string;
  startsAt: string;
  coverImageUrl?: string;
  capacity?: number;
  description?: string;
  bookedCount: number;
  organizerId?: string;
}

export interface CreateEventData {
  title: string;
  location: string;
  startsAt: string;
  capacity?: number;
  description?: string;
  coverImageUrl?: string;
  organizerId: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

export const eventsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<
      { success: boolean; events: Event[] },
      { organizerId?: string; ids?: string[] } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params?.organizerId) {
          queryParams.append("organizerId", params.organizerId);
        }

        if (params?.ids && params.ids.length > 0) {
          queryParams.append("ids", params.ids.join(","));
        }

        const queryString = queryParams.toString();
        return queryString ? `/events?${queryString}` : "/events";
      },
      providesTags: (result) =>
        result
          ? [
              ...result.events.map(({ id }) => ({
                type: "Event" as const,
                id,
              })),
              { type: "Event", id: "LIST" },
            ]
          : [{ type: "Event", id: "LIST" }],
    }),
    getEventById: builder.query<{ event: Event }, string>({
      query: (id) => `/events/${id}`,
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),
    createEvent: builder.mutation<
      { success: boolean; event: Event },
      CreateEventData
    >({
      query: (data) => ({
        url: "/events",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),
    updateEvent: builder.mutation<{ event: Event }, UpdateEventData>({
      query: ({ id, ...data }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Event", id },
        { type: "Event", id: "LIST" },
      ],
    }),
    deleteEvent: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;
