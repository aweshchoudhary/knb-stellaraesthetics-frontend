import React, { useEffect, useState } from "react";
import NoteCard from "../note/NoteCard";
import ActivityCard from "../activity/ActivityCard";
import FileCard from "../file/FileCard";
import EmailCard from "../email/EmailCard";

const AllHistory = ({ activities, notes, files }) => {
  const [allHistory, setAllHistory] = useState([]);
  useEffect(() => {
    if (activities?.length)
      activities.forEach((act) =>
        setAllHistory((prev) => [...prev, { ...act, type: "activity" }])
      );
    if (notes?.length)
      notes.forEach((note) =>
        setAllHistory((prev) => [...prev, { ...note, type: "note" }])
      );
    if (files?.length)
      files.forEach((file) =>
        setAllHistory((prev) => [...prev, { ...file, type: "file" }])
      );
  }, [activities, notes, files]);
  return (
    <ul>
      {allHistory.length !== 0 ? (
        allHistory.map((history, index) => {
          return (
            <li key={index}>
              {history.type === "note" && <NoteCard note={history} />}
              {history.type === "activity" && (
                <ActivityCard activity={history} />
              )}
              {history.type === "file" && <FileCard file={history} />}
              {history.type === "email" && <EmailCard email={history} />}
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

export default AllHistory;
