import { mainApi } from "./mainApi";

export const activityApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createActivity: builder.mutation({
      query: (data) => ({
        url: "/api/activity/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["activity"],
    }),
    getActivity: builder.query({
      query: (id) => "/pipeline/get-activity/" + id,
      providesTags: ["activity"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getActivities: builder.query({
      query: (params) => ({
        url: "/api/activity/get-activities/",
        params,
      }),
      providesTags: ["activity"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateActivity: builder.mutation({
      query: (data) => ({
        url: "/api/activity/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["activity"],
    }),
    deleteActivity: builder.mutation({
      query: (id) => ({
        url: "/api/activity/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["activity"],
    }),
  }),
});

export const {
  useGetActivityQuery,
  useLazyGetActivityQuery,
  useCreateActivityMutation,
  useDeleteActivityMutation,
  useUpdateActivityMutation,
  useGetActivitiesQuery,
  useLazyGetActivitiesQuery,
} = activityApi;
