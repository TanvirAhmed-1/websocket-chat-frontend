import { baseApi } from "../../api/baseApi";
import { setCredentials } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token =
            data?.data?.accessToken ||
            data?.accessToken ||
            data?.data?.token ||
            data?.token ||
            data?.result?.token;
          const user =
            data?.data?.user || data?.user || data?.result?.user;

          if (token) {
            dispatch(
              setCredentials({
                user: user || {
                  id: "user-1",
                  name: arg.email.split("@")[0],
                  email: arg.email,
                },
                token,
              })
            );
          }
        } catch {
          // ignore
        }
      },
    }),
    register: builder.mutation({
      query: (userData: {
        name: string;
        username?: string;
        email: string;
        password: string;
        phone: string;
        address?: string;
      }) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token =
            data?.data?.accessToken ||
            data?.accessToken ||
            data?.data?.token ||
            data?.token ||
            data?.result?.token;
          const user =
            data?.data?.user || data?.user || data?.result?.user;

          if (token && user) {
            dispatch(
              setCredentials({
                user,
                token,
              })
            );
          }
        } catch {
          // ignore
        }
      },
    }),
    updateUser: builder.mutation({
      query: ({ id, data }: { id: string; data: Record<string, unknown> }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useUpdateUserMutation } = authApi;
