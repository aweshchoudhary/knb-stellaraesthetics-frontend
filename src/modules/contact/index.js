import { lazy } from "react";

const Contacts = lazy(() => import("./pages/Contacts"));
const Contact = lazy(() => import("./pages/Contact"));

const ContactTable = lazy(() => import("./components/ContactTable"));
const EditContact = lazy(() => import("./components/EditContact"));
const ContactSelect = lazy(() => import("./components/ContactSelect"));

const CreateContactForm = lazy(() =>
  import("./components/models/CreateContactForm")
);
const CreateContactModel = lazy(() =>
  import("./components/models/CreateContactModel")
);
const SearchContacts = lazy(() => import("./components/models/SearchContacts"));

export {
  Contacts,
  Contact,
  ContactTable,
  EditContact,
  CreateContactForm,
  CreateContactModel,
  SearchContacts,
  ContactSelect,
};
