import { api } from "../../api";

export const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    chat: builder.mutation<
      { text: string },
      { messages: any[]; currentEventId?: string }
    >({
      query: (body) => ({
        url: "/ai/chat",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useChatMutation } = aiApi;
