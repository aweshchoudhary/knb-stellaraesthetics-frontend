import React, { useEffect, useState } from "react";
import FileCard from "../file/FileCard";

const EmailHistoryTab = ({ dealId }) => {
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(false);

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
