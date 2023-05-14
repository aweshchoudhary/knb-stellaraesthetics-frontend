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
    getAllFileInfo: builder.query({
      query: (data) => ({
        url: "/api/file/get-fileinfos/" + data.cardId,
        params: data.params,
      }),
      providesTags: ["file"],
      transformResponse: (res) => {
        return res.data;
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
  useGetAllFileInfoQuery,
  useAddFileMutation,
  useDownloadFileQuery,
  useDeleteFileMutation,
  useLazyGetAllFileInfoQuery,
} = fileApi;
