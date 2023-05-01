import { useLazyGetContactsQuery } from "../../../services/contactApi";
import Select from "react-select";
import { useEffect, useState } from "react";

const SearchContacts = ({ selectedContacts, setSelectedContacts }) => {
  const [searchContact, { isLoading, isFetching }] = useLazyGetContactsQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedContacts, setSearchedContacts] = useState([]);

  const handleChange = async (options) => {
    setSelectedContacts(options);
  };

  useEffect(() => {
    const fetchContacts = async (query) => {
      const res = await searchContact({ params: { search: query } });
      if (res.data) {
        const contacts = res.data.map((item) => ({
          label: `${item.contactPerson} - ${item.company}`,
          value: item._id,
        }));
        setSearchedContacts(contacts);
      }
    };
    fetchContacts(searchQuery);
  }, [searchQuery]);
  return (
    <Select
      id="deal"
      name="deal"
      label="deal"
      classNamePrefix={"select"}
      isMulti
      value={selectedContacts}
      isLoading={isFetching || isLoading}
      options={searchedContacts}
      placeholder="Search Contacts"
      onChange={handleChange}
      onInputChange={(value) => setSearchQuery(value)}
      inputValue={searchQuery}
      className="mb-2"
    ></Select>
  );
};

export default SearchContacts;
