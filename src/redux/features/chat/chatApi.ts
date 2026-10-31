import { baseApi } from "../../api/baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserConversations: builder.query({
      query: () => ({
        url: "/message/user-conversations",
        method: "GET",
      }),
      providesTags: ["conversation"],
    }),
    getMessagesByConversation: builder.query({
      query: (conversationId: string) => ({
        url: `/message/${conversationId}`,
        method: "GET",
      }),
      providesTags: ["message"],
    }),
    sendMessage: builder.mutation({
      query: (body) => ({
        url: "/message/send",
        method: "POST",
        body,
      }),
      invalidatesTags: ["message", "conversation"],
    }),
    startConversation: builder.mutation({
      query: (body: { recipientId: string }) => ({
        url: "/message/start-conversation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["conversation"],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    searchUsers: builder.query({
      query: (query: string) => ({
        url: `/user/search?query=${encodeURIComponent(query)}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetUserConversationsQuery,
  useGetMessagesByConversationQuery,
  useSendMessageMutation,
  useStartConversationMutation,
  useGetAllUsersQuery,
  useLazySearchUsersQuery,
  useSearchUsersQuery,
} = chatApi;
