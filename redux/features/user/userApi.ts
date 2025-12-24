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
      // Use "Follow" tag to update following/followers lists without
      // invalidating "User" which would trigger a session check
      invalidatesTags: ["Follow"],
    }),
  }),
});

export const { useFollowUserMutation } = userApi;
