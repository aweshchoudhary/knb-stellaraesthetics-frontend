import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../../config/BASE_URL";

export const dealApi = createApi({
  reducerPath: "dealApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getCard: builder.query({
      query: (id) => "/get-card/" + id,
    }),
  }),
});

export const { useGetCardQuery } = dealApi;
