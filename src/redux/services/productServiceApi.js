import { mainApi } from "./mainApi";

export const productServiceApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createProductService: builder.mutation({
      query: (data) => ({
        url: "/api/product-service/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["productService"],
    }),
    getProductService: builder.query({
      query: (id) => "/api/product-service/get-product-service/" + id,
      providesTags: ["productService"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getProductsServices: builder.query({
      query: (params) => ({
        url: "/api/product-service/get-products-services/",
        params,
      }),
      providesTags: ["productService"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateProductService: builder.mutation({
      query: (data) => ({
        url: "/api/product-service/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["productService"],
    }),
    deleteProductService: builder.mutation({
      query: (id) => ({
        url: "/api/product-service/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["productService"],
    }),
  }),
});

export const {
  useGetProductServiceQuery,
  useLazyGetProductServiceQuery,
  useCreateProductServiceMutation,
  useDeleteProductServiceMutation,
  useUpdateProductServiceMutation,
  useGetProductsServicesQuery,
  useLazyGetProductsServicesQuery,
} = productServiceApi;
