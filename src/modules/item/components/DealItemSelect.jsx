import React, { Suspense, useEffect, useState } from "react";
import Select from "react-select";
import { formatNumber } from "@/modules/common";
import { useLazyGetItemsQuery } from "@/redux/services/itemApi";

const ProductSelect = ({ selectedData, setSelectedData }) => {
  const [searchedData, setSearchedData] = useState([]);

  const [query, setQuery] = useState("");
  const [searchProduct, { isLoading, isFetching }] = useLazyGetItemsQuery();

  const handleChange = async (selectedOptions) => {
    setSelectedData(selectedOptions);
  };

  useEffect(() => {
    const searchDataFn = async (query) => {
      const res = await searchProduct({ search: query, data: true });
      if (!res.data) return;

      const products = res.data.map((item) => {
        return {
          label: `${item.title} - ${item.type} (${formatNumber(item.rate)})`,
          value: item._id,
        };
      });
      setSearchedData(products);
    };
    const interval = setTimeout(
      () => query.length > 2 && searchDataFn(query),
      500
    );
    return () => {
      clearTimeout(interval);
    };
  }, [query]);
  useEffect(() => {
    const preFetchData = async () => {
      const { data } = await searchProduct({ data: true });
      if (data?.length !== 0) {
        const products = data.map((product) => {
          return {
            label: `${product.title} - ${product.type} (${formatNumber(
              product.rate
            )})`,
            value: product._id,
          };
        });
        setSearchedData(products);
      }
    };
    preFetchData();
  }, []);
  return (
    <Suspense>
      <div className="w-full">
        <Select
          classNamePrefix="select"
          id="deal"
          name="deal"
          label="deal"
          className="flex-1"
          value={selectedData}
          isLoading={isFetching || isLoading}
          options={searchedData}
          placeholder="Search Product"
          onChange={handleChange}
          onInputChange={(value) => setQuery(value)}
        ></Select>
      </div>
    </Suspense>
  );
};

export default ProductSelect;
