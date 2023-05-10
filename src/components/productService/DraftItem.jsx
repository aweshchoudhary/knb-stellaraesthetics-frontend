import BASE_URL from "../../config/BASE_URL";
import Loader from "../global/Loader";
import Tooltip from "@mui/material/Tooltip";
import ProductSelect from "../select/ProductSelect";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { useLazyGetProductServiceQuery } from "../../redux/services/productServiceApi";
import Select from "react-select";

const validQtyProductType = [
  {
    label: "Pieces",
    value: "pieces",
    type: "product",
  },
  {
    label: "Nos",
    value: "nos",
    type: "product",
  },
];
const validQtyServiceType = [
  {
    label: "Hour",
    value: "hour",
    type: "service",
  },
  {
    label: "Day",
    value: "day",
    type: "service",
  },
  {
    label: "Month",
    value: "month",
    type: "service",
  },
  {
    label: "Year",
    value: "year",
    type: "service",
  },
];

const DraftItem = ({
  isSelectOpen,
  setRows,
  isOpen,
  setIsOpen,
  setIsSelectOpen,
}) => {
  const [
    getProductService,
    { isLoading, isFetching, isSuccess, isError, error },
  ] = useLazyGetProductServiceQuery();

  const [draftItem, setDraftItem] = useState({
    title: "",
    description: "",
    image: {},
    type: "",
    rate: 0,
    qty: 1,
    qty_type: "",
    discount: 0,
    discountedRate: 0,
    tax: 0,
    total: 0,
    _id: "",
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [isTax, setIsTax] = useState(false);
  const [selected, setSelected] = useState(null);
  // const [tax, setTax] = useState(0);

  function handleAddRow() {
    const {
      title,
      description,
      rate,
      discount,
      tax,
      image,
      type,
      _id,
      qty,
      qty_type,
    } = draftItem;
    let newRow = {
      title,
      description,
      image,
      type,
      rate,
      qty,
      qty_type,
      productServiceId: _id,
    };
    isDiscounted ? (newRow.discount = +discount) : null;
    isTax ? (newRow.tax = +tax) : null;
    setRows((prev) => [...prev, newRow]);
    handleCancelDraftItem();
  }
  function handleFillDraftItem(name, value) {
    setDraftItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleRateCalculate() {
    let subtotal =
      draftItem.qty > 0 ? draftItem.rate * draftItem.qty : draftItem.rate;
    if (draftItem.discount >= 0) {
      let discount = subtotal * (+draftItem.discount / 100);
      subtotal = subtotal - discount;
      handleFillDraftItem("discountedRate", subtotal);
    }
    if (draftItem.tax > 0) handleTaxCalculate();
    else handleFillDraftItem("total", Math.round(subtotal));
  }

  function handleTaxCalculate() {
    let subtotal = isDiscounted
      ? draftItem.discountedRate
      : draftItem.rate * draftItem.qty;
    let tax = subtotal * (+draftItem.tax / 100);
    let total = subtotal + tax;
    handleFillDraftItem("total", Math.round(total));
  }

  function handleCancelDraftItem() {
    setSelected(null);
    setSelectedProduct(null);
    setIsOpen(false);
  }

  const fetchItem = useCallback(async () => {
    try {
      const { data } = await getProductService(selectedProduct?.value);
      setDraftItem((prev) => ({ ...prev, ...data }));
      handleFillDraftItem("total", data.rate);
      setSelected({ label: data.qty_type, value: data.qty_type });
      setIsOpen(true);
      // Do something with the result if needed
    } catch (error) {
      console.log(error);
    }
  }, [selectedProduct]);
  console.log("working");
  useEffect(() => {
    if (selectedProduct) {
      fetchItem();
    }
  }, [selectedProduct, fetchItem]);

  useEffect(() => {
    handleRateCalculate();
  }, [draftItem.discount, draftItem.rate, draftItem.qty, draftItem.tax]);

  useEffect(() => {
    if (isError) {
      toast.error(error.data?.message);
    }
  }, [isError]);

  return (
    isSelectOpen && (
      <>
        <div className="my-3 flex gap-3">
          <ProductSelect
            selectedData={selectedProduct}
            setSelectedData={setSelectedProduct}
          />
          <button
            onClick={() => setIsSelectOpen(false)}
            type="button"
            className="btn-outlined btn-small text-red-500"
          >
            Cancel
          </button>
        </div>
        {isOpen ? (
          !isLoading && !isFetching && isSuccess ? (
            <section className="flex flex-wrap gap-3 my-4 p-5 border">
              <div className="w-1/3">
                <div className="h-[130px] w-full border flex items-center">
                  {draftItem?.image?.path ? (
                    <img
                      className="w-full h-full object-contain"
                      src={BASE_URL + draftItem.image.path}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-paper">
                      <Icon
                        className="text-8xl"
                        icon="material-symbols:image-not-supported"
                      />
                      <p>No Image</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl mb-3">{draftItem.title}</h2>
                <div className="min-h-[80px] py-2 px-4 overflow-y-auto border">
                  <p>{draftItem.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap w-full gap-3 items-end">
                <div className="w-[250px]">
                  <label htmlFor="rate" className="block mb-1">
                    Rate
                  </label>
                  <input
                    type="number"
                    className="input"
                    name="rate"
                    id="rate"
                    placeholder="Rate"
                    value={draftItem.rate}
                    onChange={(e) =>
                      handleFillDraftItem(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="qty" className="block mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    className="input"
                    name="qty"
                    id="qty"
                    placeholder="Rate"
                    value={draftItem.qty}
                    onChange={(e) =>
                      handleFillDraftItem(e.target.name, +e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="rate" className="block mb-1">
                    Qty Type
                  </label>
                  <Select
                    name="qty_type"
                    id="qty_type"
                    className="flex-1"
                    classNamePrefix="select"
                    placeholder="Quantity Type"
                    onChange={(value) => {
                      setSelected(value);
                      handleFillDraftItem("qty_type", value.value);
                    }}
                    value={selected}
                    options={
                      draftItem.type === "product"
                        ? validQtyProductType
                        : validQtyServiceType
                    }
                  />
                </div>
                <div className="w-full flex items-end gap-3">
                  {isDiscounted ? (
                    <div className="w-1/2">
                      <label htmlFor="rate" className="block mb-1">
                        Discount (%)
                      </label>
                      <div className="flex items-stretch gap-3">
                        <input
                          type="number"
                          className="input"
                          name="discount"
                          id="discount"
                          placeholder="Discount"
                          value={draftItem.discount}
                          onChange={(e) =>
                            handleFillDraftItem(e.target.name, +e.target.value)
                          }
                        />
                        <Tooltip title="Remove Discount" placement="top">
                          <button
                            onClick={() => {
                              handleFillDraftItem("discount", 0);
                              setIsDiscounted(false);
                            }}
                            className="text-xl btn-outlined btn-small"
                          >
                            <Icon icon="uil:trash" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsDiscounted(true)}
                      className="btn-outlined btn-small"
                    >
                      <Icon icon="uil:plus" />
                      <span>Discount</span>
                    </button>
                  )}
                  {isTax ? (
                    <div className="flex-1">
                      <label htmlFor="rate" className="block mb-1">
                        Tax (%)
                      </label>
                      <div className="flex items-stretch gap-3">
                        <input
                          type="number"
                          className="input"
                          name="tax"
                          id="tax"
                          placeholder="Tax"
                          value={draftItem.tax}
                          onChange={(e) =>
                            handleFillDraftItem(e.target.name, +e.target.value)
                          }
                        />
                        <Tooltip title="Remove Tax" placement="top">
                          <button
                            onClick={() => {
                              handleFillDraftItem("tax", 0);
                              setIsTax(false);
                            }}
                            className="text-xl btn-outlined btn-small"
                          >
                            <Icon icon="uil:trash" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsTax(true)}
                      className="btn-outlined btn-small"
                    >
                      <Icon icon="uil:plus" />
                      <span>Tax</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="flex mt-2 w-full items-center justify-between">
                <div className="text-lg font-medium">
                  <p>Final Rate: {draftItem.total}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="btn-outlined btn-small"
                    onClick={handleCancelDraftItem}
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleAddRow}
                    className="btn-filled btn-small"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section className="w-full h-full flex items-center justify-center">
              <Loader />
            </section>
          )
        ) : null}
      </>
    )
  );
};

export default DraftItem;
