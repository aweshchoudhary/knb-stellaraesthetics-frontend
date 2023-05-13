import React, { useMemo, useState } from "react";
import { useLazyGetNotesQuery } from "@/redux/services/noteApi";
import NoteCard from "../cards/NoteCard";
import { Loader } from "@/modules/common";

const NoteHistoryTab = ({ dealId }) => {
  const [noteHistory, setNoteHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [getNotes] = useLazyGetNotesQuery();

  useMemo(() => {
    const fetchHistories = async () => {
      setLoading(true);
      const noteData = await getNotes({
        filters: JSON.stringify([{ id: "deals", value: { $in: [dealId] } }]),
        data: true,
      });
      noteData.data.length !== 0 && setNoteHistory(noteData.data);
      setLoading(false);
    };
    fetchHistories();
  }, [dealId]);

  if (loading)
    return (
      <section className="p-10">
        <Loader />
      </section>
    );

  return (
    <ul>
      {noteHistory.length !== 0 ? (
        noteHistory.map((history, index) => {
          return (
            <li key={index}>
              <NoteCard note={history} />
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

export default NoteHistoryTab;
