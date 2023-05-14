import React, { useEffect, useState } from "react";
import { useLazyGetNotesQuery } from "@/redux/services/noteApi";
import { useLazyGetActivitiesQuery } from "@/redux/services/activityApi";
import NoteCard from "../note/NoteCard";
import ActivityCard from "../activity/ActivityCard";
import FileCard from "../file/FileCard";
import EmailCard from "../email/EmailCard";
import { Loader } from "@/modules/common";
import { useLazyGetAllFileInfoQuery } from "@/redux/services/fileApi";

const AllHistory = ({ dealId }) => {
  const [allHistory, setAllHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [getActivities] = useLazyGetActivitiesQuery();
  const [getNotes] = useLazyGetNotesQuery();
  const [getFiles] = useLazyGetAllFileInfoQuery();

  useEffect(() => {
    let isMounted = true;
    const fetchHistories = async () => {
      setLoading(true);
      const noteData = await getNotes({
        filters: JSON.stringify([{ id: "deals", value: { $in: [dealId] } }]),
        data: true,
        populate: "creator",
      });
      noteData.data.length !== 0 &&
        noteData.data.forEach((note) => {
          setAllHistory((prev) => [...prev, { ...note, type: "note" }]);
        });

      const activityData = await getActivities({
        filters: JSON.stringify([{ id: "deals", value: { $in: [dealId] } }]),
        data: true,
        populate: "performer",
      });
      activityData.data.length !== 0 &&
        activityData.data.forEach((activity) => {
          setAllHistory((prev) => [...prev, { ...activity, type: "activity" }]);
        });
      const fileData = await getFiles({
        cardId: dealId,
        params: { populate: "uploader" },
      });
      fileData.data.length !== 0 &&
        fileData.data.forEach((file) => {
          setAllHistory((prev) => [...prev, { ...file, type: "file" }]);
        });
      setLoading(false);
    };
    isMounted && fetchHistories();
    return () => (isMounted = false);
  }, [dealId]);

  if (loading)
    return (
      <section className="p-10">
        <Loader />
      </section>
    );
  return (
    <ul>
      {allHistory.length !== 0 ? (
        allHistory.map((history, index) => {
          return(
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
