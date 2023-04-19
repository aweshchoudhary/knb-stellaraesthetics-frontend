import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const stageApi = createApi({
  reducerPath: "stageApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["stage"],
  endpoints: (builder) => ({
    createStage: builder.mutation({
      query: (data) => ({
        url: "/stage/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["stage"],
    }),
    getStages: builder.query({
      query: (pipelineId) => "/stage/get-stages/" + pipelineId,
      providesTags: ["stage"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getStage: builder.query({
      query: (id) => "/stage/get-stage/" + id,
      providesTags: ["stage"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateStage: builder.mutation({
      query: (data) => ({
        url: "/stage/update/" + data.id,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: ["stage"],
    }),
    reorderStage: builder.mutation({
      query: (data) => ({
        url: "/stage/reorder",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["stage"],
    }),
    deleteStage: builder.mutation({
      query: (position) => ({
        url: "/stage/delete/" + position,
        method: "DELETE",
      }),
      invalidatesTags: ["stage"],
    }),
  }),
});

export const {
  useGetStageQuery,
  useGetStagesQuery,
  useCreateStageMutation,
  useDeleteStageMutation,
  useUpdateStageMutation,
  useReorderStageMutation,
} = stageApi;
