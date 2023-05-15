import { mainApi } from "./mainApi";

export const dealItemApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createDealItem: builder.mutation({
      query: (data) => ({
        url: "/api/deal-item/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["dealItem"],
    }),
    getDealItem: builder.query({
      query: ({ params, id }) => ({
        url: "/api/deal-item/get-deal-item/" + id,
        params,
      }),
      providesTags: ["dealItem"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getDealProductsServices: builder.query({
      query: (params) => ({
        url: "/api/deal-item/get-deal-items/",
        params,
      }),
      providesTags: ["dealItem"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateDealItem: builder.mutation({
      query: (data) => ({
        url: "/api/deal-item/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["dealItem"],
    }),
    deleteDealItem: builder.mutation({
      query: (id) => ({
        url: "/api/deal-item/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["dealItem"],
    }),
  }),
});

export const {
  useGetDealItemQuery,
  useLazyGetDealItemQuery,
  useCreateDealItemMutation,
  useDeleteDealItemMutation,
  useUpdateDealItemMutation,
  useGetDealProductsServicesQuery,
  useLazyGetDealProductsServicesQuery,
} = dealItemApi;
