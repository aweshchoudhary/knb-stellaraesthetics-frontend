import React, { Suspense, useEffect, useState } from "react";
import { useCreateNoteMutation } from "@/redux/services/noteApi";
import { toast } from "react-toastify";

import DealSelect from "../DealSelect";
import { ContactSelect } from "@/modules/contact";
import { RichTextEditor } from "@/modules/common";
import { useSelector } from "react-redux";

const Notes = ({ deals = [], contacts = [] }) => {
  const [createNote, { isLoading, isSuccess, error, isError }] =
    useCreateNoteMutation();
  const [noteBody, setNoteBody] = useState("");
  const [isClear, setIsClear] = useState(false);
  const [selectedDeals, setSelectedDeals] = useState(deals);
  const [selectedContacts, setSelectedContacts] = useState(contacts);
  const loggedUserId = useSelector((state) => state.auth.loggedUserId);

  async function handleCreateNote() {
    const selectedContactsFiltered = selectedContacts.map((item) => item.value);
    const selectedDealsFiltered = selectedDeals.map((item) => item.value);
    await createNote({
      noteBody,
      deals: selectedDealsFiltered,
      contacts: selectedContactsFiltered,
      creator: loggedUserId,
    });
  }
  function handleClear() {
    setNoteBody("");
    setIsClear(true);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Note has been created");
      handleClear();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(error.data.message || error.message);
    }
  }, [isError]);
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
            compare={deals}
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
          {isLoading ? "Loading..." : "Create note"}
        </button>
      </footer>
    </Suspense>
  );
};

export default Notes;
