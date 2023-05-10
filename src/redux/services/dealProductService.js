import { mainApi } from "./mainApi";

export const dealProductServiceApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createDealProductService: builder.mutation({
      query: (data) => ({
        url: "/api/deal-product-service/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["dealProductService"],
    }),
    getDealProductService: builder.query({
      query: ({ params, id }) => ({
        url: "/api/deal-product-service/get-product-service/" + id,
        params,
      }),
      providesTags: ["dealProductService"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getDealProductsServices: builder.query({
      query: (params) => ({
        url: "/api/deal-product-service/get-products-services/",
        params,
      }),
      providesTags: ["dealProductService"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateDealProductService: builder.mutation({
      query: (data) => ({
        url: "/api/deal-product-service/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["dealProductService"],
    }),
    deleteDealProductService: builder.mutation({
      query: (id) => ({
        url: "/api/deal-product-service/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["dealProductService"],
    }),
  }),
});

export const {
  useGetDealProductServiceQuery,
  useLazyGetDealProductServiceQuery,
  useCreateDealProductServiceMutation,
  useDeleteDealProductServiceMutation,
  useUpdateDealProductServiceMutation,
  useGetDealProductsServicesQuery,
  useLazyGetDealProductsServicesQuery,
} = dealProductServiceApi;
