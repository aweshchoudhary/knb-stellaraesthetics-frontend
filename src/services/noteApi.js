import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/api/note" }),
  tagTypes: ["note"],
  endpoints: (builder) => ({
    createNote: builder.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["note"],
    }),
    getNote: builder.query({
      query: (id) => "/get-note/" + id,
      providesTags: ["note"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getNotes: builder.query({
      query: (params) => ({
        url: "/get-notes/",
        params,
      }),
      providesTags: ["note"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateNote: builder.mutation({
      query: (data) => ({
        url: "/update/" + data.id,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: ["note"],
    }),
    deleteNote: builder.mutation({
      query: (id) => ({
        url: "/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["note"],
    }),
  }),
});

export const {
  useGetNoteQuery,
  useUpdateNoteMutation,
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
} = noteApi;
