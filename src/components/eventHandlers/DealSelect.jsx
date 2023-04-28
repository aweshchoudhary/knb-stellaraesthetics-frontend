import { useEffect, useState } from "react";
import Select from "react-select";
import { useLazySearchCardsQuery } from "../../services/dealApi";

const DealSelect = ({ selectedData, setSelectedData, compare = [] }) => {
  const [searchedData, setSearchedData] = useState([]);

  const [query, setQuery] = useState("");
  const [searchCard, { isLoading, isFetching }] = useLazySearchCardsQuery();

  const handleChange = async (selectedOptions) => {
    setSelectedData(selectedOptions);
  };

  useEffect(() => {
    const searchDataFn = async (query) => {
      const res = await searchCard(query);
      const mainOptions = { label: "Open Deals", options: [] };
      const otherOptions = { label: "Other Deals", options: [] };
      if (res.data) {
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
            if (item._id === comp.value) {
              mainOptions.options.push(option);
            } else {
              otherOptions.options.push(option);
            }
          });
        });
        setSearchedData(compare ? [mainOptions, otherOptions] : [otherOptions]);
      }
    };
    query.length > 2 && searchDataFn(query);
  }, [query]);
  return (
    <div>
      <h2 className="mb-1">Select Deals</h2>
      <Select
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