import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const dealApi = createApi({
  reducerPath: "dealApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["deal"],
  endpoints: (builder) => ({
    createDeal: builder.mutation({
      query: (data) => ({
        url: "/deal/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["deal"],
    }),
    getDeal: builder.query({
      query: (id) => "/deal/get-deal/" + id,
      providesTags: ["deal"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    searchDeals: builder.query({
      query: (query) => "/deal/search?query=" + query,
      providesTags: ["deal"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getDealsByStage: builder.query({
      query: (stageId) => "/deal/get-deals/" + stageId,
      providesTags: ["deal"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getDealsByContactId: builder.query({
      query: (contactId) => "/deal/get-deals-by-client/" + contactId,
      providesTags: ["deal"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateDeal: builder.mutation({
      query: (data) => ({
        url: "/deal/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["deal"],
    }),
    updateDealStage: builder.mutation({
      query: (data) => ({
        url: "/deal/deal-stage",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["deal"],
    }),
    deleteDeal: builder.mutation({
      query: (id) => ({
        url: "/deal/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["deal"],
    }),
  }),
});

export const {
  useGetDealQuery,
  useGetDealsByContactIdQuery,
  useLazyGetDealQuery,
  useCreateDealMutation,
  useDeleteDealMutation,
  useUpdateDealMutation,
  useUpdateDealStageMutation,
  useGetDealsByStageQuery,
  useLazyGetDealsByStageQuery,
  useLazySearchDealsQuery,
} = dealApi;
