import { mainApi } from "./mainApi";

export const itemApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createItem: builder.mutation({
      query: (data) => ({
        url: "/api/item/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["item"],
    }),
    getItem: builder.query({
      query: (id) => "/api/item/get-item/" + id,
      providesTags: ["item"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getItems: builder.query({
      query: (params) => ({
        url: "/api/item/get-items/",
        params,
      }),
      providesTags: ["item"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateItem: builder.mutation({
      query: (data) => ({
        url: "/api/item/update/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["item"],
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: "/api/item/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["item"],
    }),
  }),
});

export const {
  useGetItemQuery,
  useLazyGetItemQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
  useGetItemsQuery,
  useLazyGetItemsQuery,
} = itemApi;
