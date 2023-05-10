import React, { Suspense, lazy, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-phone-number-input/style.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Country } from "country-state-city";
import { Icon } from "@iconify/react";
import ReactDatePicker from "react-datepicker";
import { useSelector } from "react-redux";

import { Label } from "@/modules/deal";

import { useLazyGetStagesQuery } from "@/redux/services/stageApi";
import { useCreateDealMutation } from "@/redux/services/dealApi";
import { useGetPipelinesQuery } from "@/redux/services/pipelineApi";
import { useCreateDealProductServiceMutation } from "@/redux/services/dealProductService";

const Select = lazy(() => import("react-select"));
import { DealItemTable } from "@/modules/item";

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
  value: Yup.number(),
  currency: Yup.string(),
  label: Yup.string().required("Label is required"),
  expectedClosingDate: Yup.date().required("Expected closing date is required"),
});

const CreateDealForm = ({ setIsOpen, pipelineId, selectedContacts }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => handleCreateDeal(values),
  });

  const loggedUserId = useSelector((state) => state.auth.loggedUserId);
  const [itemRows, setItemRows] = useState([]);

  const [getStages, { data: stages }] = useLazyGetStagesQuery();
  const [expectedDate, setExpectedDate] = useState(new Date());
  const [tableCurrency, setTableCurrency] = useState("INR");

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

  const [createDeal, { data: deal, isLoading, isError, error, isSuccess }] =
    useCreateDealMutation();
  const [
    createDealProductService,
    { isLoading: isItemLoading, isSuccess: isItemSuccess },
  ] = useCreateDealProductServiceMutation();
  const { data } = useGetPipelinesQuery({ data: true });

  async function handleCreateDeal(values) {
    const contacts = selectedContacts.map((item) => item.value);

    // Validation
    const newDeal = {
      ...values,
      contacts,
      expectedClosingDate: expectedDate,
      creator: loggedUserId,
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
    const createItemFn = async (data) => await createDealProductService(data);
    if (isSuccess && itemRows.length !== 0) {
      itemRows.forEach((row) => {
        const { productServiceId, rate, qty, qty_type, discount, tax } = row;
        createItemFn({
          dealId: deal._id,
          productServiceId,
          rate,
          qty,
          qty_type,
          discount,
          tax,
          currency: tableCurrency?.value,
        });
      });
      toast.success("Deal has been created");
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isItemSuccess) {
      toast.success("Deal has been created");
    }
  }, [isItemSuccess]);

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
    <Suspense>
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
            <DealItemTable
              rows={itemRows}
              setRows={setItemRows}
              setTableCurrency={setTableCurrency}
              tableCurrency={tableCurrency}
            />
            {itemRows.length <= 0 && (
              <div className="input-value mb-3">
                <label
                  htmlFor="amount-value"
                  className="text-textColor block mb-2"
                >
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
            )}
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
            disabled={isLoading || isItemLoading}
            onClick={() => setIsOpen(false)}
            type="button"
          >
            cancel
          </button>
          <button
            disabled={isLoading || isItemLoading}
            className="btn-filled btn-small"
            type="submit"
          >
            {isLoading || isItemLoading ? "Loading..." : "create deal"}
          </button>
        </footer>
      </form>
    </Suspense>
  );
};

export default CreateDealForm;
