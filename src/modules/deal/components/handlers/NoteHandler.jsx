import React, { Suspense, useEffect, useState } from "react";
import { useCreateNoteMutation } from "@/redux/services/noteApi";
import { toast } from "react-toastify";

import DealSelect from "../DealSelect";
import { ContactSelect } from "@/modules/contact";
import { RichTextEditor } from "@/modules/common";

const Notes = ({ cards = [], contacts = [] }) => {
  const [createNote, { isLoading, isSuccess }] = useCreateNoteMutation();
  const [noteBody, setNoteBody] = useState("");
  const [isClear, setIsClear] = useState(false);
  const [selectedDeals, setSelectedDeals] = useState(cards);
  const [selectedContacts, setSelectedContacts] = useState(contacts);

  async function handleCreateNote() {
    const selectedContactsFiltered = selectedContacts.map((item) => item.value);
    const selectedDealsFiltered = selectedDeals.map((item) => item.value);
    await createNote({
      noteBody,
      deals: selectedDealsFiltered,
      contacts: selectedContactsFiltered,
    });
    handleClear();
  }
  function handleClear() {
    setNoteBody("");
    setIsClear(true);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Note has been created");
    }
  }, [isSuccess]);

  return (
    <Suspense>
      <div className="px-5 py-3">
        <RichTextEditor
          setContent={setNoteBody}
          setIsClear={setIsClear}
          clear={isClear}
          placeholder={"Enter a note"}
        />
        <div className="my-3 ">
          <p className="mb-1">Deals</p>
          <DealSelect
            selectedData={selectedDeals}
            setSelectedData={setSelectedDeals}
            compare={cards}
          />
        </div>
        <div className="my-3">
          <p className="mb-1">Contacts</p>
          <ContactSelect
            selectedData={selectedContacts}
            setSelectedData={setSelectedContacts}
            compare={contacts}
          />
        </div>
      </div>
      <footer className="flex items-center px-5 py-3 border-t gap-2 justify-end">
        <button
          disabled={isLoading}
          className="btn-outlined btn-small"
          onClick={handleClear}
        >
          clear
        </button>
        <button
          className="btn-filled flex btn-small items-center justify-center"
          onClick={handleCreateNote}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "add note"}
        </button>
      </footer>
    </Suspense>
  );
};

export default Notes;
