import { api } from "../../api";

export const feedbackApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitFeedback: builder.mutation<
      { success: boolean; message: string },
      any
    >({
      query: (body) => ({
        url: "/feedback",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Feedback"],
    }),
  }),
});

export const { useSubmitFeedbackMutation } = feedbackApi;
