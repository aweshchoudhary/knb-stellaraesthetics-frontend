import React from "react";
import NoteCard from "./NoteCard";

const NoteHistoryTab = ({ notes = [] }) => {
  return (
    <ul>
      {notes.length !== 0 ? (
        notes.map((history, index) => {
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
