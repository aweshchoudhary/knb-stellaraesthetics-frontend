import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const dealApi = createApi({
  reducerPath: "dealApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/api/deal" }),
  tagTypes: ["deal"],
  endpoints: (builder) => ({
    createDeal: builder.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["deal"],
    }),
    getDeal: builder.query({
      query: (id) => "/get-deal/" + id,
      providesTags: ["deal"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getDeals: builder.query({
      query: (params) => ({
        url: "/get-deals/",
        params,
      }),
      providesTags: ["deal"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateDeal: builder.mutation({
      query: (data) => ({
        url: "/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["deal"],
    }),
    updateDealStage: builder.mutation({
      query: (data) => ({
        url: "-stage",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["deal"],
    }),
    deleteDeal: builder.mutation({
      query: (id) => ({
        url: "/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["deal"],
    }),
  }),
});

export const {
  useGetDealQuery,
  useLazyGetDealQuery,
  useCreateDealMutation,
  useDeleteDealMutation,
  useUpdateDealMutation,
  useUpdateDealStageMutation,
  useGetDealsQuery,
  useLazyGetDealsQuery,
} = dealApi;
