import { useEffect, useState } from "react";
import Select from "react-select";
import { useLazySearchCardsQuery } from "../../services/dealApi";

const DealSelect = ({ data, selectedData, searchedData, setSearchedData }) => {
  const [query, setQuery] = useState("");
  const [searchCard, { isLoading, isFetching }] = useLazySearchCardsQuery();

  useEffect(() => {
    const searchDataFn = async (query) => {
      const res = await searchCard(query);
      if (res.data) {
        const cards = res.data.map((item) => {
          return {
            label: item.title,
            value: item._id,
          };
        });
        setSearchedData(cards);
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
        options={searchedData}
        value={selectedData}
        placeholder="Search Deal"
        onChange={(value) => {
          setSearchedData(value);
          fillEventInfo("cardId", value.value);
        }}
        onInputChange={(value) => setQuery(value)}
        className="mb-2 text-sm"
      ></Select>
    </div>
  );
};

export default DealSelect;
