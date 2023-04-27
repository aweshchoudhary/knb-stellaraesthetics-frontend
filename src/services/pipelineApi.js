import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const pipelineApi = createApi({
  reducerPath: "pipelineApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["pipeline"],
  endpoints: (builder) => ({
    createPipeline: builder.mutation({
      query: (data) => ({
        url: "/pipeline/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pipeline"],
    }),
    getPipeline: builder.query({
      query: (id) => "/pipeline/get-pipeline/" + id,
      providesTags: ["pipeline"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getPipelines: builder.query({
      query: (id) => "/pipeline/get-pipelines/",
      providesTags: ["pipeline"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updatePipeline: builder.mutation({
      query: (data) => ({
        url: "/pipeline/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["pipeline"],
    }),
    deletePipeline: builder.mutation({
      query: (id) => ({
        url: "/pipeline/delete/" + id,
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
  useGetPipelinesQuery,
  useLazyGetPipelinesQuery,
} = pipelineApi;
