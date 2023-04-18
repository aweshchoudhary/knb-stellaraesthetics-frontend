import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["note"],
  endpoints: (builder) => ({
    createNote: builder.mutation({
      query: (data) => ({
        url: "/note/add",
        method: "POST",
        body: data.body,
      }),
      invalidatesTags: ["note"],
    }),
    getNote: builder.query({
      query: (id) => "/note/get-note/" + id,
      providesTags: ["note"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateNote: builder.mutation({
      query: (data) => ({
        url: "/note/update/" + data.id,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: ["note"],
    }),
    deleteNote: builder.mutation({
      query: (id) => ({
        url: "/note/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["note"],
    }),
  }),
});

export const { useGetNoteQuery } = noteApi;
