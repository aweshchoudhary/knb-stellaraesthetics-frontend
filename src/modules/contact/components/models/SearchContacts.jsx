import { useLazyGetContactsQuery } from "@/redux/services/contactApi";
import Select from "react-select";
import React, { Suspense, useEffect, useState } from "react";

const SearchContacts = ({ selectedContacts, setSelectedContacts }) => {
  const [searchContacts, { isLoading, isFetching }] = useLazyGetContactsQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedContacts, setSearchedContacts] = useState([]);

  const handleChange = async (options) => {
    setSelectedContacts(options);
  };

  useEffect(() => {
    const fetchContacts = async (query) => {
      const res = await searchContacts({ search: query, data: true });
      if (res.data) {
        const contacts = res.data.map((item) => ({
          label: `${item.contactPerson} - ${item.company}`,
          value: item._id,
        }));
        setSearchedContacts(contacts);
      }
    };

    const interval = setTimeout(
      () => searchQuery.length > 2 && fetchContacts(searchQuery),
      500
    );
    return () => {
      clearTimeout(interval);
    };
  }, [searchQuery]);
  return (
    <Suspense>
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
    </Suspense>
  );
};

export default SearchContacts;
