import React, { useEffect, useState } from "react";
import { useLazyGetAllFileInfoQuery } from "@/redux/services/fileApi";
import FileCard from "./FileCard";

const FileHistoryTab = ({ dealId }) => {
  const [fileHistory, setFileHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [getFiles] = useLazyGetAllFileInfoQuery();

  useEffect(() => {
    const fetchHistories = async () => {
      setLoading(true);
      const fileData = await getFiles({
        cardId: dealId,
        params: { populate: "uploader" },
      });
      fileData.data.length !== 0 && setFileHistory(fileData.data);
      setLoading(false);
    };
    fetchHistories();
  }, [dealId]);
  return (
    !loading && (
      <ul>
        {fileHistory.length !== 0 ? (
          fileHistory.map((history, index) => {
            return (
              <li key={index}>
                <FileCard file={history} />
              </li>
            );
          })
        ) : (
          <section className="p-10 text-center bg-bg mt-3">
            <p>No history to show</p>
          </section>
        )}
      </ul>
    )
  );
};

export default FileHistoryTab;
