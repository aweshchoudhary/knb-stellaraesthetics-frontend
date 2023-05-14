import { mainApi } from "./mainApi";

export const fileApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    addFile: builder.mutation({
      query: (data) => ({
        url: "/api/file/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["file"],
    }),
    getFiles: builder.query({
      query: (params) => ({
        url: "/api/file/get-files",
        params,
      }),
      providesTags: ["contact"],
      transformResponse: (response) => {
        return response.data;
      },
    }),
    downloadFile: builder.query({
      query: (filename) => "/download/" + filename,
      providesTags: ["file"],
    }),
    deleteFile: builder.mutation({
      query: (id) => ({
        url: "/api/file/delete/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["file"],
    }),
  }),
});

export const {
  useAddFileMutation,
  useDownloadFileQuery,
  useDeleteFileMutation,
  useGetFilesQuery,
  useLazyGetFilesQuery,
} = fileApi;
