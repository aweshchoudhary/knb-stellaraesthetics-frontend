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
      query: (cardId) => "/api/file/get-fileinfos/" + cardId,
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
} = fileApi;
