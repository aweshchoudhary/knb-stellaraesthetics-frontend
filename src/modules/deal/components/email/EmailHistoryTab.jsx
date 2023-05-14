import React, { useEffect, useState } from "react";
import { useLazyGetAllFileInfoQuery } from "@/redux/services/fileApi";
import FileCard from "../file/FileCard";

const EmailHistoryTab = ({ dealId }) => {
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [getFiles] = useLazyGetAllFileInfoQuery();

  useEffect(() => {
    const fetchHistories = async () => {
      setLoading(true);
      const emailData = await getFiles({
        filters: JSON.stringify([{ id: "deals", value: { $in: [dealId] } }]),
        data: true,
      });
      emailData.data.length !== 0 && setEmailHistory(emailData.data);
      setLoading(false);
    };
    fetchHistories();
  }, [dealId]);
  return (
    !loading && (
      <ul>
        {emailHistory.length !== 0 ? (
          emailHistory.map((history, index) => {
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

export default EmailHistoryTab;
