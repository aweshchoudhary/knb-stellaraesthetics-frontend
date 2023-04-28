import { useEffect, useState } from "react";
import RichTextEditor from "../global/RichTextEditor";
import { useCreateNoteMutation } from "../../services/noteApi";
import DealSelect from "./DealSelect";
import { toast } from "react-toastify";

const Notes = ({ card }) => {
  const [createNote, { isLoading, isSuccess }] = useCreateNoteMutation();
  const [noteBody, setNoteBody] = useState("");
  const [deals, setDeals] = useState([card]);

  async function handleCreateNote() {
    const selectedDeals = deals.map((item) => item.value);
    await createNote({ noteBody, cardId: selectedDeals });
    handleClear();
  }
  function handleClear() {
    setNoteBody("");
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Note has been created");
    }
  }, [isSuccess]);

  return (
    <section className="p-5">
      <div>
        <DealSelect
          selectedData={deals}
          setSelectedData={setDeals}
          compare={[card]}
        />
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