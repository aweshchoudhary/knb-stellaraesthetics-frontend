import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const labelApi = createApi({
  reducerPath: "labelApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["label"],
  endpoints: (builder) => ({
    createLabel: builder.mutation({
      query: (data) => ({
        url: "/label/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["label"],
    }),
    getLabel: builder.query({
      query: (id) => "/label/get-label/" + id,
      providesTags: ["label"],
      transformResponse: (res) => {
        return res.data;
      },
    }),
    getLabels: builder.query({
      query: () => "/label/get-labels/",
      providesTags: ["label"],
      transformResponse: (res) => {
        return res.data;
      },
    }),
    updateLabel: builder.mutation({
      query: (data) => ({
        url: "/label/update/" + data.id,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: ["label"],
    }),
    deleteLabel: builder.mutation({
      query: (id) => ({
        url: "/label/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["label"],
    }),
  }),
});

export const {
  useGetLabelQuery,
  useLazyGetLabelQuery,
  useCreateLabelMutation,
  useDeleteLabelMutation,
  useGetLabelsQuery,
  useUpdateLabelMutation,
} = labelApi;
