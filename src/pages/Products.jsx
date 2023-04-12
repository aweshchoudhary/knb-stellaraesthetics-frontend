import ProductTable from "../components/tables/ProductTable";
import Header from "../components/global/Header";
import { Icon } from "@iconify/react";

const Products = () => {
  return (
    <>
      <Header title={"Products"} />
      <section className="p-2 flex items-center justify-between">
        <button className="btn-filled">
          <Icon icon={"uil:plus"} className="text-2xl" />
          <span>Product</span>
        </button>
        <div className="searchbox w-[25%] rounded border flex items-center px-3">
          <Icon icon={"bx:search"} className="text-2xl" />
          <input
            type="search"
            name="search"
            id="product-search"
            placeholder="Search..."
            className="input bg-transparent border-0"
          />
        </div>
      </section>
      <section>
        <ProductTable />
      </section>
    </>
  );
};

export default Products;
