import React from "react";
import { Header } from "@/modules/common";
import { ItemTable } from "@/modules/item";

const Items = () => {
  return (
    <>
      <Header title={"Items"} />
      <section>
        <ItemTable />
      </section>
    </>
  );
};

export default Items;
