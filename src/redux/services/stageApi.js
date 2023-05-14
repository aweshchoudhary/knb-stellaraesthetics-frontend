import { mainApi } from "./mainApi";

export const stageApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createStage: builder.mutation({
      query: (data) => ({
        url: "/api/stage/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["stage"],
    }),
    getStages: builder.query({
      query: (params) => ({
        url: "/api/stage/get-stages/",
        params,
      }),
      providesTags: ["stage"],
    }),
    getStage: builder.query({
      query: (id) => "/api/stage/get-stage/" + id,
      providesTags: ["stage"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateStage: builder.mutation({
      query: (data) => ({
        url: "/api/stage/update/" + data.stageId,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["stage"],
    }),
    reorderStage: builder.mutation({
      query: (stage) => ({
        url: "/api/stage/reorder/" + stage.pipelineId,
        method: "PUT",
        body: stage.data,
      }),
      invalidatesTags: ["stage"],
    }),
    deleteStage: builder.mutation({
      query: (stage) => ({
        url: `/${stage.pipelineId}/${stage.position}`,
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
