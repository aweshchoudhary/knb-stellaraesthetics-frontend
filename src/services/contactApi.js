import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/api/contact" }),
  tagTypes: ["contact"],
  endpoints: (builder) => ({
    getContact: builder.query({
      query: (id) => "/get-contact/" + id,
      providesTags: ["contact"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getContacts: builder.query({
      query: (params) => ({
        url: "/get-contacts/",
        params,
      }),
      providesTags: ["contact"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    createContact: builder.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        return response.data;
      },
      invalidatesTags: ["contact"],
    }),
    updateContact: builder.mutation({
      query: (data) => ({
        url: "/update/" + data.id,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: ["contact"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: "/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useGetContactQuery,
  useCreateContactMutation,
  useDeleteContactMutation,
  useUpdateContactMutation,
  useLazyGetContactsQuery,
  useLazyGetContactQuery,
} = contactApi;
