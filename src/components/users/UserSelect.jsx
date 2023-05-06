import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useLazyGetUsersQuery } from "../../redux/services/userApi";

const UserSelect = ({ selectedData, setSelectedData }) => {
  const [searchedData, setSearchedData] = useState([]);

  const [query, setQuery] = useState("");
  const [searchUser, { isLoading, isFetching }] = useLazyGetUsersQuery();

  const handleChange = async (selectedOption) => {
    setSelectedData(selectedOption);
  };

  useEffect(() => {
    const searchDataFn = async (query) => {
      const res = await searchUser({ search: query });
      if (!res?.data?.data) return;
      const users = res.data.data.map((item) => ({
        label: `${item.fullname} (${item.username})`,
        value: item._id,
      }));
      console.log(users);
      setSearchedData(users);
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
    <div className="w-full">
      <Select
        classNamePrefix="select"
        id="User"
        name="User"
        label="User"
        value={selectedData}
        isLoading={isFetching || isLoading}
        options={searchedData}
        placeholder="Search User"
        onChange={handleChange}
        onInputChange={(value) => setQuery(value)}
      ></Select>
    </div>
  );
};

export default UserSelect;
