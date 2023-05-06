import React from "react";
import ProductServiceTable from "../components/tables/ProductServiceTable";
import Header from "../components/global/Header";

const ProductsServices = () => {
  return (
    <>
      <Header title={"Items"} />
      <section>
        <ProductServiceTable />
      </section>
    </>
  );
};

export default ProductsServices;
