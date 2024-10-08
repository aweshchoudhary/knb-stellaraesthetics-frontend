import React, { Suspense, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  useAddFileMutation,
  useDeleteFileMutation,
  useLazyGetFilesQuery,
} from "@/redux/services/fileApi";

import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";
import moment from "moment";

import { BASE_URL } from "@/modules/common";
import { DealSelect } from "@/modules/deal";
import { useSelector } from "react-redux";
import { ContactSelect } from "@/modules/contact";

const File = ({
  deals = [],
  contacts = [],
  dealId,
  getByDealsId,
  getByContactsId,
}) => {
  const [selectedDeals, setSelectedDeals] = useState(deals);
  const [selectedContacts, setSelectedContacts] = useState(contacts);

  const [getFiles, { data: files, isLoading, isFetching, isSuccess }] =
    useLazyGetFilesQuery();

  const fileInputRef = useRef();

  const [uploadFile, { isLoading: isUploading, isSuccess: isUploadSuccess }] =
    useAddFileMutation();

  const [deleteFile, { isSuccess: isDeleteSuccess }] = useDeleteFileMutation();

  const loggedUserId = useSelector((state) => state.auth.loggedUserId);

  async function handleUploadFile(file) {
    const dealIds = selectedDeals.map((i) => i.value);
    const contactIds = selectedContacts.map((i) => i.value);
    const newFormData = new FormData();
    newFormData.append("file", file);
    newFormData.append("dealId", dealIds);
    newFormData.append("contactId", contactIds);
    newFormData.append("uploader", loggedUserId);
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
    const fetchFiles = async (query) =>
      await getFiles({
        filters: JSON.stringify(query),
        data: true,
        populate: "uploader",
      });
    if (getByDealsId) fetchFiles([{ id: "dealId", value: { $in: [dealId] } }]);
    const contactIds = selectedContacts.map((i) => i.value);
    if (getByContactsId)
      fetchFiles([{ id: "contactId", value: { $in: contactIds } }]);
  }, [dealId, contacts]);

  useEffect(() => {
    isUploadSuccess && toast.success("File Upload Successful!");
  }, [isUploadSuccess]);
  useEffect(() => {
    isDeleteSuccess && toast.success("File Deleted Successful!");
  }, [isDeleteSuccess]);

  return (
    <Suspense>
      <section className="p-5">
        {!isLoading && !isFetching && isSuccess ? (
          <ul>
            {files.length > 0 ? (
              files.map((file, index) => {
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
              })
            ) : (
              <li>No files has been attached</li>
            )}
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
        <div className="my-3">
          <h2 className="mb-1">Deal Select</h2>
          <DealSelect
            selectedData={selectedDeals}
            setSelectedData={setSelectedDeals}
            compare={deals}
          />
        </div>
        <div className="mb-3">
          <h2 className="mb-1">Contact Select</h2>
          <ContactSelect
            selectedData={selectedContacts}
            setSelectedData={setSelectedContacts}
            compare={contacts ? contacts : null}
          />
        </div>
      </section>
      <footer className="flex items-center px-5 py-3 border-t gap-2 justify-end">
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
    </Suspense>
  );
};

export default File;
