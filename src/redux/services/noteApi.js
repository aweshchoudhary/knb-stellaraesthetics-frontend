import { mainApi } from "./mainApi";

export const noteApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    createNote: builder.mutation({
      query: (data) => ({
        url: "/api/note/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["note"],
    }),
    getNote: builder.query({
      query: (id) => "/api/note/get-note/" + id,
      providesTags: ["note"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    getNotes: builder.query({
      query: (params) => ({
        url: "/api/note/get-notes/",
        params,
      }),
      providesTags: ["note"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    updateNote: builder.mutation({
      query: (data) => ({
        url: "/api/note/update/" + data.id,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: ["note"],
    }),
    deleteNote: builder.mutation({
      query: (id) => ({
        url: "/api/note/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["note"],
    }),
  }),
});

export const {
  useGetNoteQuery,
  useUpdateNoteMutation,
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
} = noteApi;
