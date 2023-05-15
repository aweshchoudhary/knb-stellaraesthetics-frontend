import React from "react";
import FileCard from "./FileCard";

const FileHistoryTab = ({ files }) => {
  return (
    <ul>
      {files.length !== 0 ? (
        files.map((history, index) => {
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
  );
};

export default FileHistoryTab;
