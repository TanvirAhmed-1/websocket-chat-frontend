import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout } from "../features/auth/authSlice";
import { removeTokenCookie } from "../server/storeCookies";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const rawBaseQuery = fetchBaseQuery({
      baseUrl,
      credentials: "include",
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    });

    const result = await rawBaseQuery(args, api, extraOptions);

    if (result?.error && result.error.status === 401) {
      api.dispatch(logout());
      await removeTokenCookie();
    }

    return result;
  } catch (error) {
    console.error("Unexpected API Error:", error);
    return {
      error: { status: "FETCH_ERROR", data: "Unexpected error occurred" },
    };
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: dynamicBaseQuery,
  tagTypes: ["user", "message", "conversation"],
  keepUnusedDataFor: 120,
  refetchOnReconnect: true,
  refetchOnFocus: false,
  endpoints: () => ({}),
});

