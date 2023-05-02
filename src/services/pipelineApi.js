import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const pipelineApi = createApi({
  reducerPath: "pipelineApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/api/pipeline" }),
  tagTypes: ["pipeline"],
  endpoints: (builder) => ({
    createPipeline: builder.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pipeline"],
    }),
    getPipeline: builder.query({
      query: (id) => "/get-pipeline/" + id,
      providesTags: ["pipeline"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getPipelines: builder.query({
      query: (params) => ({
        url: "/get-pipelines/",
        params,
      }),
      providesTags: ["pipeline"],
    }),
    updatePipeline: builder.mutation({
      query: (data) => ({
        url: "/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["pipeline"],
    }),
    deletePipeline: builder.mutation({
      query: (id) => ({
        url: "/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["pipeline"],
    }),
  }),
});

export const {
  useGetPipelineQuery,
  useCreatePipelineMutation,
  useUpdatePipelineMutation,
  useDeletePipelineMutation,
  useLazyGetPipelineQuery,
  useLazyGetPipelinesQuery,
  useGetPipelinesQuery,
} = pipelineApi;
