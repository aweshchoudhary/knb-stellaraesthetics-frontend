import React, { useEffect, useState } from "react";
import { useLazyGetStagesQuery } from "../../../redux/services/stageApi";
import { useCreateDealMutation } from "../../../redux/services/dealApi";
import { useGetPipelinesQuery } from "../../../redux/services/pipelineApi";
import Label from "../../deal/label/Label";
import { toast } from "react-toastify";
import ReactDatePicker from "react-datepicker";
import "react-phone-number-input/style.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Country } from "country-state-city";
import Select from "react-select";
import { Icon } from "@iconify/react";
import { dealApi } from "../../../redux/services/dealApi";
import { useDispatch } from "react-redux";
import ProductSelect from "../../select/ProductSelect";
import CurrencySelect from "../../select/CurrencySelect";

const initialValues = {
  title: "",
  pipelineId: "",
  currentStage: "",
  value: 0,
  currency: "INR",
  label: "",
  expectedClosingDate: new Date(),
};
const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  pipelineId: Yup.string().required("Pipeline is required"),
  currentStage: Yup.string().required("Stage is required"),
  value: Yup.number().required("Value is required"),
  currency: Yup.string().required("Currency is required"),
  label: Yup.string().required("Label is required"),
  expectedClosingDate: Yup.date().required("Expected closing date is required"),
});
const CreateDealForm = ({ setIsOpen, pipelineId, selectedContacts }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => handleCreateDeal(values),
  });

  const dispatch = useDispatch();

  const [getStages, { data: stages }] = useLazyGetStagesQuery();
  const [expectedDate, setExpectedDate] = useState(new Date());

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [currentCurrency, setCurrentCurrency] = useState({});

  const AllCountriesCurrencyData = Country.getAllCountries().map((country) => {
    if (!currentCurrency?.label && country.currency === "INR") {
      setCurrentCurrency({
        label: `${country.flag} ${country.name} (${country.currency})`,
        value: country.currency,
      });
    }

    return {
      label: `${country.flag} ${country.name} (${country.currency})`,
      value: country.currency,
    };
  });

  function handleCurrencyChange(newCurrency) {
    formik.values.currency = newCurrency.value;
    setCurrentCurrency(newCurrency);
  }

  const [pipeId, setPipeId] = useState(pipelineId);
  const [label, setLabel] = useState("");

  const [createDeal, { isLoading, isError, error, isSuccess }] =
    useCreateDealMutation();

  const { data } = useGetPipelinesQuery({ data: true });

  async function handleCreateDeal(values) {
    const contacts = selectedContacts.map((item) => item.value);

    // Validation
    const newDeal = {
      ...values,
      contacts,
      expectedClosingDate: expectedDate,
    };
    await createDeal(newDeal);
    setIsOpen(false);
  }

  const fetchStages = async (pipeId) => {
    await getStages({
      filters: JSON.stringify([{ id: "pipelineId", value: pipeId }]),
      data: true,
    });
  };

  useEffect(() => {
    const refetchDeals = async () =>
      await dispatch(dealApi.endpoints.getDeals.initiate({ data: true }));
    if (isSuccess) {
      toast.success("Deal has been created");
      refetchDeals();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [isError]);

  useEffect(() => {
    if (pipeId) {
      formik.values.pipelineId = pipeId;
      fetchStages(pipeId);
    }
    if (!pipeId && data?.data?.length) fetchStages(data.data[0]._id);
  }, [pipeId, data?.data]);

  useEffect(() => {
    if (stages?.data?.length) {
      formik.values.currentStage = stages?.data[0]._id;
    }
  }, [stages?.data]);

  useEffect(() => {
    formik.values.label = label;
  }, [label]);

  useEffect(() => {
    formik.values.expectedClosingDate = expectedDate;
  }, [expectedDate]);

  useEffect(() => {
    formik.values.currency = currentCurrency.value;
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <section className="container h-full">
        <div className="h-full md:p-10 p-5">
          <div className="input-title mb-3">
            <label htmlFor="title" className="text-textColor block  mb-2">
              Deal Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Title"
              className="input"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                <Icon icon="ic:round-error" className="text-lg" />
                {formik.errors.title}
              </div>
            ) : null}
          </div>
          <AddProductTable
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
          <div className="input-value mb-3">
            <label htmlFor="amount-value" className="text-textColor block mb-2">
              Value
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  name="value"
                  id="amount-value"
                  placeholder="Value"
                  min={0}
                  className="input w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={Number(formik.values.value)}
                />
                {formik.touched.value && formik.errors.value ? (
                  <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                    <Icon icon="ic:round-error" className="text-lg" />
                    {formik.errors.value}
                  </div>
                ) : null}
              </div>
              <div className="flex-1">
                <Select
                  name="currency"
                  id="currency" // like inr,usd
                  classNamePrefix="select"
                  options={AllCountriesCurrencyData}
                  onChange={handleCurrencyChange}
                  onBlur={formik.handleBlur}
                  value={currentCurrency}
                />
              </div>
            </div>
          </div>
          <div className="input-pipeline mb-3">
            <label htmlFor="stage" className="text-textColor block mb-2">
              Pipeline
            </label>
            <select
              name="pipelineId"
              id="pipelineId"
              className="input capitalize"
              onChange={(e) => {
                formik.handleChange(e);
                setPipeId(e.target.value);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.pipelineId}
            >
              {data?.data?.map((item, i) => {
                return item._id === formik.values.pipelineId ? (
                  <option
                    key={i}
                    selected
                    className="text-black"
                    value={item._id}
                    defaultValue={item._id}
                  >
                    {item.name}
                  </option>
                ) : (
                  <option
                    key={i}
                    className="text-black"
                    value={item._id}
                    defaultValue={item._id}
                  >
                    {item.name}
                  </option>
                );
              })}
            </select>
            {formik.touched.pipelineId && formik.errors.pipelineId ? (
              <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                <Icon icon="ic:round-error" className="text-lg" />
                {formik.errors.pipelineId}
              </div>
            ) : null}
          </div>
          <div className="input-stage mb-3">
            <label htmlFor="stage" className="text-textColor block mb-2">
              Stage
            </label>
            <select
              name="currentStage"
              id="currentStage"
              className="input capitalize"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentStage}
            >
              {stages?.data?.map((item, i) => {
                return item._id === formik.values.currentStage ? (
                  <option
                    key={i}
                    className="text-black"
                    selected
                    defaultValue={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                ) : (
                  <option key={i} className="text-black" value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            {formik.touched.currentStage && formik.errors.currentStage ? (
              <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                <Icon icon="ic:round-error" className="text-lg" />
                {formik.errors.currentStage}
              </div>
            ) : null}
          </div>
          <div className="input-label mb-3">
            <label htmlFor="label" className="text-textColor block mb-2">
              Label
            </label>
            <Label setLabel={setLabel} label={label} />
            {formik.touched.label && formik.errors.label ? (
              <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                <Icon icon="ic:round-error" className="text-lg" />
                {formik.errors.label}
              </div>
            ) : null}
          </div>
          <div className="input-close-date mb-3">
            <label htmlFor="close-date" className="text-textColor block mb-2">
              Expected Close Date
            </label>
            {/* <input type="date" name="expectedClosingDate" /> */}
            <ReactDatePicker
              className="input"
              name="expectedClosingDate"
              id="expectedClosingDate"
              minDate={new Date()}
              onChange={(date) => setExpectedDate(date)}
              onBlur={formik.handleBlur}
              selected={expectedDate}
              value={expectedDate}
            />
            {formik.touched.expectedClosingDate &&
            formik.errors.expectedClosingDate ? (
              <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                <Icon icon="ic:round-error" className="text-lg" />
                {formik.errors.expectedClosingDate}
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <footer className="modal-footer">
        <button
          className="btn-outlined btn-small"
          disabled={isLoading}
          onClick={() => setIsOpen(false)}
          type="button"
        >
          cancel
        </button>
        <button
          disabled={isLoading}
          className="btn-filled btn-small"
          type="submit"
        >
          {isLoading ? "Loading..." : "create deal"}
        </button>
      </footer>
    </form>
  );
};

const AddProductTable = ({
  selectedProduct,
  setSelectedProduct,
  setSelectedCurrency,
  selectedCurrency,
}) => {
  return (
    <div className="my-5">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Items Table</h2>
        <button className="btn-outlined btn-small">
          <Icon icon="uil:plus" className="text-xl" />
          <span>Add Item</span>
        </button>
      </header>
      <DraftItem
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
      <div className="w-1/3">
        <CurrencySelect
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
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
            {/* {view?.userRole === "owner" && ( */}
            <th scope="col" className="p-3">
              Action
            </th>
            {/* )} */}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-3">
              <img
                width={100}
                height={100}
                className="w-[80px]"
                src="https://images.adsttc.com/media/images/6286/ac71/03d0/a701/6541/0bf1/newsletter/yellow-foot-residential-building-oa-lab_6.jpg?1652993321"
              />
            </td>
            <td className="capitalize p-3 font-medium">Product title here</td>
            <td className="p-3">Service</td>
            <td className="p-3">1000</td>
            {/* {view && view?.userRole === "owner" && ( */}
            <td className="p-3">
              <button
                // disabled={view.userRole !== "owner"}
                // onClick={handleRemoveUser}
                className="btn-outlined btn-small"
              >
                {/* {isRemoveLoading ? "Loading..." : "remove"} */}
                Remove
              </button>
            </td>
            {/* )} */}
          </tr>
          <tr className="border-b">
            <td className="p-3 text-right border-r" colSpan={4}>
              Sub Total
            </td>
            <td className="p-3 text-right">1000</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 text-right border-r" colSpan={4}>
              Discount
            </td>
            <td className="p-3 text-right">1000</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 text-right border-r" colSpan={4}>
              Total Before Tax
            </td>
            <td className="p-3 text-right">1000</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 text-right border-r" colSpan={4}>
              Tax (18%)
            </td>
            <td className="p-3 text-right">1000</td>
          </tr>
          <tr className="border-b font-semibold bg-paper">
            <td className="p-3 text-right border-r" colSpan={4}>
              Grand Total
            </td>
            <td className="p-3 text-right">1000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const DraftItem = ({ selectedProduct, setSelectedProduct }) => {
  return (
    <>
      <div className="my-3 flex gap-3">
        <ProductSelect
          selectedData={selectedProduct}
          setSelectedData={setSelectedProduct}
        />
        <button className="btn-filled btn-small shrink-0 grow-1">
          Select Item
        </button>
      </div>
      <section className="flex gap-5 my-4">
        <div className="w-1/3">
          <div className="h-[200px] w-full border"></div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl mb-3">Product Title Here</h2>
          <div className="h-[80px] py-2 px-4 overflow-y-auto border">
            <p>this is a product description</p>
          </div>
          <div className="flex gap-3 my-3">
            <div className="flex-1">
              <label htmlFor="rate" className="block mb-1">
                Rate
              </label>
              <input
                type="number"
                className="input"
                name="rate"
                id="rate"
                placeholder="Rate"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="rate" className="block mb-1">
                Discount
              </label>
              <input
                type="number"
                className="input"
                name="discount"
                id="discount"
                placeholder="Discount"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateDealForm;
