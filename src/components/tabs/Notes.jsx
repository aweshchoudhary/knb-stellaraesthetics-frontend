import { useState } from "react";
import RichTextEditor from "../global/RichTextEditor";
import { useCreateNoteMutation } from "../../services/noteApi";

const Notes = ({ cardId }) => {
  const [createNote, { isLoading, isSuccess }] = useCreateNoteMutation();
  const [noteBody, setNoteBody] = useState("");

  async function handleCreateNote() {
    await createNote({ noteBody, cardId });
    handleClear();
  }
  function handleClear() {
    setNoteBody("");
  }
  return (
    <section className="p-5">
      <div>
        <RichTextEditor setContent={setNoteBody} />
        <div className="flex items-center mt-3 gap-2">
          <button
            disabled={isLoading}
            className="btn-outlined"
            onClick={handleClear}
          >
            clear
          </button>
          <button
            className="btn-filled flex items-center justify-center"
            onClick={handleCreateNote}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "add note"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Notes;
