import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  useAddFileMutation,
  useDeleteFileMutation,
  useGetAllFileInfoQuery,
  fileApi,
  useDownloadFileQuery,
} from "../../services/fileApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";
import moment from "moment";
import { useDispatch } from "react-redux";
import BASE_URL from "../../config/BASE_URL";

const File = () => {
  const params = useParams();
  const { id } = params;
  const {
    data: files,
    isLoading,
    isFetching,
    isSuccess,
  } = useGetAllFileInfoQuery(id);
  const fileInputRef = useRef();
  const [
    uploadFile,
    {
      isLoading: isUploading,
      isError: isUploadError,
      isSuccess: isUploadSuccess,
    },
  ] = useAddFileMutation();
  const [
    deleteFile,
    { isLoading: isDeleting, isSuccess: isDeleteSuccess, isError },
  ] = useDeleteFileMutation();
  const dispatch = useDispatch();

  async function handleUploadFile(file) {
    const newFormData = new FormData();
    newFormData.append("file", file);
    newFormData.append("cardId", id);
    await uploadFile(newFormData);
  }
  async function handleDeleteFile(fileId) {
    await deleteFile(fileId);
  }
  async function handleDownloadFile(fileName) {
    await fetch(BASE_URL + "/file/download/" + fileName)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
      });
  }

  function formatFileSize(bytes) {
    const sufixes = ["B", "kB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sufixes[i]}`;
  }

  useEffect(() => {
    isUploadSuccess && toast.success("File Upload Successful!");
    isDeleteSuccess && toast.success("File Deleted Successful!");
  }, [isUploadSuccess, isDeleteSuccess]);

  return (
    <>
      <section className="p-5">
        {!isLoading && !isFetching && isSuccess ? (
          <ul>
            {files?.map((file, index) => {
              return (
                <li
                  key={index}
                  id={index}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="uil:file" className="text-xl" />
                    <p className="text-sm">
                      {file.name} (
                      {moment(file.createdAt).format("Do MMMM YYYY")})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p>{formatFileSize(file.size)}</p>
                    <button onClick={() => handleDownloadFile(file.name)}>
                      <Icon
                        icon="material-symbols:download"
                        className="text-xl"
                      />
                    </button>
                    <button onClick={() => handleDeleteFile(file._id)}>
                      <Icon icon="uil:trash" className="text-xl" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div>
            <Skeleton
              variant="rectangular"
              height={25}
              sx={{ width: "100%" }}
              className="mb-2"
            />
            <Skeleton
              variant="rectangular"
              height={25}
              sx={{ width: "100%" }}
              className="mb-2"
            />
            <Skeleton
              variant="rectangular"
              height={25}
              sx={{ width: "100%" }}
              className="mb-2"
            />
            <Skeleton
              variant="rectangular"
              height={25}
              sx={{ width: "100%" }}
              className="mb-2"
            />
          </div>
        )}
      </section>
      <footer className="p-5 border-t">
        <input
          type="file"
          onChange={(e) => handleUploadFile(e.target.files[0])}
          className="input absolute top-full left-full opacity-0"
          id="upload-file"
          name="upload-file"
          ref={fileInputRef}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="btn-filled btn-small"
        >
          {isUploading ? "Uploading..." : "upload file"}
        </button>
      </footer>
    </>
  );
};

export default File;
