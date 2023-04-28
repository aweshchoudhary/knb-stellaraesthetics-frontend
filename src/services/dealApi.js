import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const dealApi = createApi({
  reducerPath: "dealApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["deal"],
  endpoints: (builder) => ({
    createCard: builder.mutation({
      query: (data) => ({
        url: "/card/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["deal"],
    }),
    getCard: builder.query({
      query: (id) => "/card/get-card/" + id,
      providesTags: ["deal"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    searchCards: builder.query({
      query: (query) => "/card/search?query=" + query,
      providesTags: ["deal"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getCardsByStage: builder.query({
      query: (stageId) => "/card/get-cards/" + stageId,
      providesTags: ["deal"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getCardsByClientId: builder.query({
      query: (clientId) => "/card/get-cards-by-client/" + clientId,
      providesTags: ["deal"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateCard: builder.mutation({
      query: (data) => ({
        url: "/card/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["deal"],
    }),
    updateCardStage: builder.mutation({
      query: (data) => ({
        url: "/card/card-stage",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["deal"],
    }),
    deleteCard: builder.mutation({
      query: (id) => ({
        url: "/card/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["deal"],
    }),
  }),
});

export const {
  useGetCardQuery,
  useGetCardsByClientIdQuery,
  useLazyGetCardQuery,
  useCreateCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
  useUpdateCardStageMutation,
  useGetCardsByStageQuery,
  useLazySearchCardsQuery,
} = dealApi;
