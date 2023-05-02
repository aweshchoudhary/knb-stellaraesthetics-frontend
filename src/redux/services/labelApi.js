import { mainApi } from "./mainApi";

export const labelApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createLabel: builder.mutation({
      query: (data) => ({
        url: "/api/label/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["label"],
    }),
    getLabel: builder.query({
      query: (id) => "/api/label/get-label/" + id,
      providesTags: ["label"],
      transformResponse: (res) => {
        return res.data;
      },
    }),
    getLabels: builder.query({
      query: () => "/get-labels/",
      providesTags: ["label"],
      transformResponse: (res) => {
        return res.data;
      },
    }),
    updateLabel: builder.mutation({
      query: (data) => ({
        url: "/api/label/update/" + data.id,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: ["label"],
    }),
    deleteLabel: builder.mutation({
      query: (id) => ({
        url: "/api/label/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["label"],
    }),
  }),
});

export const {
  useGetLabelQuery,
  useLazyGetLabelQuery,
  useCreateLabelMutation,
  useDeleteLabelMutation,
  useGetLabelsQuery,
  useUpdateLabelMutation,
} = labelApi;
