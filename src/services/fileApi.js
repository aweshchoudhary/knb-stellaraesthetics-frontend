import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BASE_URL from "../config/BASE_URL";

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL + "/api/file" }),
  tagTypes: ["file"],
  endpoints: (builder) => ({
    addFile: builder.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["file"],
    }),
    getAllFileInfo: builder.query({
      query: (cardId) => "/get-fileinfos/" + cardId,
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
        url: "/delete/" + id,
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
