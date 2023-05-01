import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["contact"],
  endpoints: (builder) => ({
    getContact: builder.query({
      query: (id) => "/contact/get-contact/" + id,
      providesTags: ["contact"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getContacts: builder.query({
      query: (params) => ({
        url: "/contact/get-contacts/",
        params,
      }),
      providesTags: ["contact"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    createContact: builder.mutation({
      query: (data) => ({
        url: "/contact/add",
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
        url: "/contact/update/" + data.id,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: ["contact"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: "/contact/delete/" + id,
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
