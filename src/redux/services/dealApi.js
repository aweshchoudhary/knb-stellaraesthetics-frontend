import { mainApi } from "./mainApi";

export const dealApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createDeal: builder.mutation({
      query: (data) => ({
        url: "/api/deal/add",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        return response.data;
      },
      invalidatesTags: ["deal"],
    }),
    getDeal: builder.query({
      query: (data) => ({
        url: "/api/deal/get-deal/" + data.id,
        params: data.params,
      }),
      providesTags: ["deal"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getDeals: builder.query({
      query: (params) => ({
        url: "/api/deal/get-deals/",
        params,
      }),
      providesTags: ["deal"],
    }),
    updateDeal: builder.mutation({
      query: (data) => ({
        url: "/api/deal/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["deal"],
    }),
    updateDealStage: builder.mutation({
      query: (data) => ({
        url: "/api/deal/deal-stage",
        method: "PUT",
        body: data,
      }),
      // invalidatesTags: ["deal"],
    }),
    deleteDeal: builder.mutation({
      query: (id) => ({
        url: "/api/deal/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["deal"],
    }),
  }),
});

export const {
  useGetDealQuery,
  useLazyGetDealQuery,
  useCreateDealMutation,
  useDeleteDealMutation,
  useUpdateDealMutation,
  useUpdateDealStageMutation,
  useGetDealsQuery,
  useLazyGetDealsQuery,
} = dealApi;
