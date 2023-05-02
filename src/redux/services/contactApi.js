import { mainApi } from "./mainApi";

export const contactApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getContact: builder.query({
      query: (id) => "/api/pipeline/get-contact/" + id,
      providesTags: ["contact"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getContacts: builder.query({
      query: (params) => ({
        url: "/api/pipeline/get-contacts/",
        params,
      }),
      providesTags: ["contact"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    createContact: builder.mutation({
      query: (data) => ({
        url: "/api/pipeline/add",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        return response.data;
      },
      invalidatesTags: ["contact"],
    }),
    updateContact: builder.mutation({
      query: (data) => ({
        url: "/api/pipeline/update/" + data.id,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: ["contact"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: "/api/pipeline/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useGetContactQuery,
  useCreateContactMutation,
  useDeleteContactMutation,
  useUpdateContactMutation,
  useLazyGetContactsQuery,
  useLazyGetContactQuery,
} = contactApi;
