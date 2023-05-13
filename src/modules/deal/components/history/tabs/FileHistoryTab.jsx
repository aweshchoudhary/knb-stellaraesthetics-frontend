import React, { useEffect, useState } from "react";
import { useLazyGetAllFileInfoQuery } from "@/redux/services/fileApi";
import FileCard from "../cards/FileCard";

const FileHistoryTab = ({ dealId }) => {
  const [fileHistory, setFileHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [getFiles] = useLazyGetAllFileInfoQuery();

  useEffect(() => {
    const fetchHistories = async () => {
      setLoading(true);
      const fileData = await getFiles({
        filters: JSON.stringify([{ id: "deals", value: { $in: [dealId] } }]),
        data: true,
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
