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
        url: "/stage/update/" + data.stageId,
        method: "PUT",
        body: { name: data.name },
      }),
      invalidatesTags: ["stage"],
    }),
    reorderStage: builder.mutation({
      query: (stage) => ({
        url: "/stage/reorder/" + stage.pipelineId,
        method: "PUT",
        body: stage.data,
      }),
      invalidatesTags: ["stage"],
    }),
    deleteStage: builder.mutation({
      query: (stage) => ({
        url: `/stage/${stage.pipelineId}/${stage.position}`,
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
  useLazyGetStagesQuery,
} = stageApi;
