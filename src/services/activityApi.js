import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const activityApi = createApi({
  reducerPath: "activityApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["activity"],
  endpoints: (builder) => ({
    createActivity: builder.mutation({
      query: (data) => ({
        url: "/activity/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["activity"],
    }),
    getActivity: builder.query({
      query: (id) => "/activity/get-activity/" + id,
      providesTags: ["activity"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getActivities: builder.query({
      query: (params) => ({
        url: "/activity/get-activities/",
        params,
      }),
      providesTags: ["activity"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateActivity: builder.mutation({
      query: (data) => ({
        url: "/activity/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["activity"],
    }),
    deleteActivity: builder.mutation({
      query: (id) => ({
        url: "/activity/delete/" + id,
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
