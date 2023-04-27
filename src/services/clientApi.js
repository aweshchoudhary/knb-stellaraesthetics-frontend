import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["client"],
  endpoints: (builder) => ({
    getClient: builder.query({
      query: (id) => "/client/get-client/" + id,
      providesTags: ["client"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getClientsByCardId: builder.query({
      query: (id) => "/client/get-client/" + id,
      providesTags: ["client"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getClients: builder.query({
      query: (data) => ({
        url: "/client/get-clients/",
        params: data.params,
      }),
      providesTags: ["client"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    createClient: builder.mutation({
      query: (data) => ({
        url: "/client/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["client"],
    }),
    updateClient: builder.mutation({
      query: (data) => ({
        url: "/client/update/" + data.id,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: ["client"],
    }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: "/client/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["client"],
    }),
  }),
});

export const {
  useGetClientQuery,
  useCreateClientMutation,
  useDeleteClientMutation,
  useUpdateClientMutation,
  useLazyGetClientsQuery,
  useUpdateClientStageMutation,
} = clientApi;
