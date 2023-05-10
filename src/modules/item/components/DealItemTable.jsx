import React, { Suspense, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import { BASE_URL, Loader, CurrencySelect } from "@/modules/common";
import { DealDraftItem } from "@/modules/item";

const ItemTable = ({ rows = [], setRows, setTableCurrency, tableCurrency }) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isDraftOpen, setIsDraftOpen] = useState(false);

  function handleRemoveRow(index) {
    let copiedRows = [...rows];
    copiedRows.splice(index, 1);
    setRows(copiedRows);
  }

  return (
    <Suspense>
      <div className="my-5">
        <header className="flex items-center justify-between mb-4">
          {isSelectOpen && <h2 className="text-xl font-medium">Items Table</h2>}
          {!isSelectOpen && (
            <button
              onClick={() => setIsSelectOpen(true)}
              className="btn-outlined btn-small"
            >
              <Icon icon="uil:plus" className="text-xl" />
              <span>Add Item</span>
            </button>
          )}
        </header>
        <Suspense
          fallback={
            <section className="h-full w-full flex items-center justify-center">
              <Loader />
            </section>
          }
        >
          {isSelectOpen ? (
            <DealDraftItem
              isSelectOpen={isSelectOpen}
              setIsSelectOpen={setIsSelectOpen}
              setRows={setRows}
              isOpen={isDraftOpen}
              setIsOpen={setIsDraftOpen}
            />
          ) : null}
        </Suspense>
        {rows.length !== 0 && (
          <>
            <div className="w-1/3">
              <CurrencySelect
                selectedCurrency={tableCurrency}
                setSelectedCurrency={setTableCurrency}
              />
            </div>
            <table className="min-w-full border border-collapse text-left text-sm font-light mt-3">
              <thead className="border-b font-medium bg-paper">
                <tr>
                  <th scope="col" className="p-3">
                    Image
                  </th>
                  <th scope="col" className="p-3">
                    Title
                  </th>
                  <th scope="col" className="p-3">
                    Type
                  </th>
                  <th scope="col" className="p-3">
                    Rate
                  </th>
                  <th scope="col" className="p-3">
                    Qty
                  </th>
                  <th scope="col" className="p-3">
                    Qty Type
                  </th>
                  <th scope="col" className="p-3">
                    Discount (%)
                  </th>
                  <th scope="col" className="p-3">
                    Tax (%)
                  </th>
                  <th scope="col" className="p-3">
                    Total
                  </th>
                  <th scope="col" className="p-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <RenderRow
                    key={index}
                    handleRemoveRow={handleRemoveRow}
                    index={index}
                    row={row}
                  />
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </Suspense>
  );
};

const RenderRow = ({ row, index, handleRemoveRow }) => {
  const [total, setTotal] = useState(row?.rate);
  const [discountedRate, setDiscountedRate] = useState(0);

  function handleTotalCalculate() {
    let subtotal = row.qty > 0 ? row.rate * row.qty : row.rate;
    if (row.discount >= 0) {
      let discount = subtotal * (+row.discount / 100);
      subtotal = subtotal - discount;
      setDiscountedRate(subtotal);
    }
    if (row.tax > 0) handleTaxCalculate();
    else setTotal(+subtotal);
  }
  function handleTaxCalculate() {
    let subtotal = +row.discount >= 0 ? discountedRate : row.rate * row.qty;
    let tax = subtotal * (+row.tax / 100);
    let total = subtotal + tax;
    setTotal(total);
  }

  useEffect(() => {
    if (row) {
      handleTotalCalculate();
    }
  }, [row]);

  return (
    row && (
      <tr key={index} className="border-b">
        <td className="p-3">
          <img
            width={100}
            height={100}
            className="w-[80px]"
            src={BASE_URL + row.image.path}
          />
        </td>
        <td className="capitalize p-3 font-medium">{row.title}</td>
        <td className="p-3">{row.type}</td>
        <td className="p-3">{row.rate}</td>
        <td className="p-3">{row.qty}</td>
        <td className="p-3">{row.qty_type}</td>
        <td className="p-3">{row.discount || "--"}</td>
        <td className="p-3">{row.tax || "--"}</td>
        <td className="p-3">{total}</td>
        <td className="p-3">
          <button
            className="btn-outlined btn-small"
            onClick={() => handleRemoveRow(index)}
          >
            <Icon icon="uil:trash" />
          </button>
        </td>
      </tr>
    )
  );
};

export default ItemTable;
