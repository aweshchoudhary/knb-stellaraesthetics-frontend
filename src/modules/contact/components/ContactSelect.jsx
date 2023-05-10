import React, { Suspense, useEffect, useState } from "react";
import Select from "react-select";
import { useLazyGetContactsQuery } from "@/redux/services/contactApi";

const ContactSelect = ({ selectedData, setSelectedData, compare = [] }) => {
  const [searchedData, setSearchedData] = useState([]);

  const [query, setQuery] = useState("");
  const [searchContact, { isLoading, isFetching }] = useLazyGetContactsQuery();

  const handleChange = async (selectedOptions) => {
    setSelectedData(selectedOptions);
  };

  useEffect(() => {
    const searchDataFn = async (query) => {
      const res = await searchContact({ search: query, data: true });
      const mainOptions = { label: "Open Contacts", options: [] };
      const otherOptions = { label: "Other Contacts", options: [] };

      if (!res.data) return;

      res.data.map((item) => {
        const option = {
          label: item.contactPerson,
          value: item._id,
        };
        if (!compare.length > 0) {
          otherOptions.options.push(option);
          return;
        }
        compare.forEach((comp) => {
          if (option.value === comp.value) {
            mainOptions.options.push(option);
          } else {
            otherOptions.options.push(option);
          }
        });
      });
      setSearchedData(
        compare.length ? [mainOptions, otherOptions] : [otherOptions]
      );
    };
    const interval = setTimeout(
      () => query.length > 2 && searchDataFn(query),
      500
    );
    return () => {
      clearTimeout(interval);
    };
  }, [query]);
  return (
    <Suspense>
      <div className="w-full">
        <Select
          classNamePrefix="select"
          id="Contact"
          name="Contact"
          label="Contact"
          isMulti
          value={selectedData}
          isLoading={isFetching || isLoading}
          options={searchedData}
          placeholder="Search Contact"
          onChange={handleChange}
          onInputChange={(value) => setQuery(value)}
        ></Select>
      </div>
    </Suspense>
  );
};

export default ContactSelect;
