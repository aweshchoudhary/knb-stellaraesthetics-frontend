import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useLazyGetDealsQuery } from "../../redux/services/dealApi";

const DealSelect = ({ selectedData, setSelectedData, compare = [] }) => {
  const [searchedData, setSearchedData] = useState([]);

  const [query, setQuery] = useState("");
  const [searchDeal, { isLoading, isFetching }] = useLazyGetDealsQuery();

  const handleChange = async (selectedOptions) => {
    setSelectedData(selectedOptions);
  };

  useEffect(() => {
    const searchDataFn = async (query) => {
      const res = await searchDeal({ search: query, data: true });
      const mainOptions = { label: "Open Deals", options: [] };
      const otherOptions = { label: "Other Deals", options: [] };

      if (!res.data) return;

      res.data.map((item) => {
        const option = {
          label: item.title,
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
    <div style={{ color: "var(--text-color) !important" }}>
      <h2 className="mb-1">Select Deals</h2>
      <Select
        classNamePrefix="select"
        id="deal"
        name="deal"
        label="deal"
        isMulti
        value={selectedData}
        isLoading={isFetching || isLoading}
        options={searchedData}
        placeholder="Search Deal"
        onChange={handleChange}
        onInputChange={(value) => setQuery(value)}
        className="mb-2"
      ></Select>
    </div>
  );
};

export default DealSelect;
