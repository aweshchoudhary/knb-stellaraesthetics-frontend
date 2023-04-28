import { useState } from "react";
import { Icon } from "@iconify/react";
import CreateContactForm from "./CreateContactForm";
import SearchContacts from "./SearchContacts";

const CreateContactModel = ({
  setIsOpen,
  handleComplete,
  selectedContacts,
  setSelectedContacts,
}) => {
  const [createNewContactSectionDisplay, setCreateNewContactSectionDisplay] =
    useState(false);

  function handleAddClient() {
    handleComplete && handleComplete(selectedContacts);
  }

  return (
    <section>
      <div className="p-5 pb-0">
        <div className="Search-Contacts mb-3">
          <label className="text-textColor block  mb-2">Search Contacts</label>
          <SearchContacts
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
          />
        </div>
      </div>
      {!createNewContactSectionDisplay && (
        <button
          type="button"
          className="btn-filled btn-small m-5"
          onClick={() => setCreateNewContactSectionDisplay(true)}
        >
          <Icon icon="uil:plus" className="text-lg" /> Contact
        </button>
      )}

      {createNewContactSectionDisplay && (
        <CreateContactForm
          setSelectedContacts={setSelectedContacts}
          setIsOpen={setCreateNewContactSectionDisplay}
        />
      )}
      <footer className="modal-footer">
        <button
          className="btn-outlined"
          type="button"
          // disabled={isLoading}
          onClick={() => setIsOpen(false)}
        >
          cancel
        </button>
        <button
          // disabled={isLoading}
          className="btn-filled"
          onClick={handleAddClient}
          disabled={!selectedContacts?.length}
        >
          add contacts
        </button>
      </footer>
    </section>
  );
};

export default CreateContactModel;
