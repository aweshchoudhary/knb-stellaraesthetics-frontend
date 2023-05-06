import { mainApi } from "./mainApi";

export const pipelineApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createPipeline: builder.mutation({
      query: (data) => ({
        url: "/api/pipeline/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pipeline"],
    }),
    verifyPipelineUser: builder.query({
      query: (pipelineId) => "/api/pipeline/verify-user/" + pipelineId,
    }),
    getPipeline: builder.query({
      query: (id) => "/api/pipeline/get-pipeline/" + id,
      providesTags: ["pipeline"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getPipelines: builder.query({
      query: (params) => ({
        url: "/api/pipeline/get-pipelines/",
        params,
      }),
      providesTags: ["pipeline"],
    }),
    updatePipeline: builder.mutation({
      query: (data) => ({
        url: "/api/pipeline/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["pipeline"],
    }),
    assignPipelineUser: builder.mutation({
      query: (data) => ({
        url: "/api/pipeline/assign/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["pipeline"],
    }),
    removePipelineUser: builder.mutation({
      query: (data) => ({
        url: "/api/pipeline/remove/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["pipeline"],
    }),
    transferPipelineOwnership: builder.mutation({
      query: (data) => ({
        url: "/api/pipeline/transfer-ownership/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["pipeline"],
    }),
    deletePipeline: builder.mutation({
      query: (id) => ({
        url: "/api/pipeline/delete/" + id,
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
  useVerifyPipelineUserQuery,
  useLazyVerifyPipelineUserQuery,
  useAssignPipelineUserMutation,
  useRemovePipelineUserMutation,
  useTransferPipelineOwnershipMutation,
} = pipelineApi;
