import { mainApi } from "./mainApi";

export const userApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/api/user/getme",
      providesTags: ["user"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getUser: builder.query({
      query: (id) => "/api/user/" + id,
      providesTags: ["user"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: "/api/user/" + data.id,
        method: "PUT",
        body: data.update,
      }),
      invalidatesTags: ["user"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: "/api/user/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetUserQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = userApi;
