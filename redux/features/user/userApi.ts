import { api } from "../../api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    followUser: builder.mutation<
      {
        success: boolean;
        message: string;
        isFollowing: boolean;
        followerCount: number;
      },
      { targetUserId: string }
    >({
      query: (body) => ({
        url: "/user/follow",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useFollowUserMutation } = userApi;
