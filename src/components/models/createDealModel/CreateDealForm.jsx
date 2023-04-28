import { useEffect, useState } from "react";
import Label from "../../deal/label/Label";
import { useLazyGetStagesQuery } from "../../../services/stageApi";
import { useCreateCardMutation } from "../../../services/dealApi";
import { useGetPipelinesQuery } from "../../../services/pipelineApi";
import { toast } from "react-toastify";
import ReactDatePicker from "react-datepicker";
import "react-phone-number-input/style.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Country } from "country-state-city";
import Select from "react-select";
import { Icon } from "@iconify/react";

let initialValues = {
  title: "",
  pipeline: "",
  stage: "",
  value: { value: "", type: "inr" },
  label: "",
  expectedClosingDate: new Date(),
};

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  pipeline: Yup.string().required("Pipeline is required"),
  stage: Yup.string().required("Stage is required"),
  value: Yup.object({
    value: Yup.number().positive("Value must be positive"),
    type: Yup.string(),
  }),
  label: Yup.string().required("Label is required"),
  expectedClosingDate: Yup.date().required("Expected closing date is required"),
});

const CreateDealForm = ({ setIsOpen, pipelineId, selectedContacts }) => {
  const [getStages, { data = [] }] = useLazyGetStagesQuery();
  const [dealData, setDealData] = useState({
    title: "",
    value: "",
    currentStage: "",
    label: "",
    expectedClosingDate: new Date(),
  });

  let currentCountry = {};

  const AllCountriesCurrencyData = Country.getAllCountries().map((country) => {
    if (country.currency === "INR")
      currentCountry = {
        label: `${country.flag} ${country.name} (${country.currency})`,
        value: country.currency,
      };
    return {
      label: `${country.flag} ${country.name} (${country.currency})`,
      value: country.currency,
    };
  });

  function handleCurrencyChange(newCurrency) {
    formik.values.value.type = newCurrency.value;
  }

  const [pipeId, setPipeId] = useState(pipelineId);
  const [label, setLabel] = useState("");

  const [createCard, { isLoading, isError, error, isSuccess }] =
    useCreateCardMutation();

  const { data: pipelines } = useGetPipelinesQuery();

  async function handleCreateDeal(values) {
    const contacts = selectedContacts.map((item) => item.value);

    const newCard = {
      title: values.title,
      value: values.value,
      currentStage: values.stage,
      label: values.label,
      expectedClosingDate: values.expectedClosingDate,
      contacts,
    };
    await createCard(newCard);
    setIsOpen(false);
  }

  const fetchStages = async (pipeId) => {
    await getStages(pipeId);
  };

  // Validation

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => handleCreateDeal(values),
  });

  useEffect(() => {
    if (isSuccess) toast.success("Deal has been created");
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error(error);
  }, [isError]);

  useEffect(() => {
    if (pipeId) {
      formik.values.pipeline = pipeId;
      fetchStages(pipeId);
    }
  }, [pipeId]);

  useEffect(() => {
    if (!pipeId && pipelines?.length) fetchStages(pipelines[0]._id);
  }, [pipeId, pipelines]);

  useEffect(() => {
    if (data.length) {
      formik.values.stage = data[0]._id;
    }
  }, [data]);

  useEffect(() => {
    formik.values.label = label;
  }, [label]);

  useEffect(() => {
    formik.values.value.type = currentCountry.value;
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
          <div className="input-value mb-3">
            <label htmlFor="amount-value" className="text-textColor block mb-2">
              Value
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  name="value.value"
                  id="amount-value"
                  placeholder="Value"
                  className="input w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.value.value}
                />
                {formik.touched.value?.value && formik.errors.value?.value ? (
                  <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                    <Icon icon="ic:round-error" className="text-lg" />
                    {formik.errors.value.value}
                  </div>
                ) : null}
              </div>
              <div className="flex-1">
                <Select
                  name="value"
                  id="value-type" // like inr,usd
                  // className="input w-1/2"
                  options={AllCountriesCurrencyData}
                  onChange={handleCurrencyChange}
                  onBlur={formik.handleBlur}
                  value={currentCountry}
                />
              </div>
            </div>
          </div>
          <div className="input-pipeline mb-3">
            <label htmlFor="stage" className="text-textColor block mb-2">
              Pipeline
            </label>
            <select
              name="pipeline"
              id="pipeline"
              className="input capitalize"
              onChange={(e) => {
                formik.handleChange(e);
                setPipeId(e.target.value);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.pipeline}
            >
              {pipelines?.map((item, i) => {
                return item._id === formik.values.pipeline ? (
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
            {formik.touched.pipeline && formik.errors.pipeline ? (
              <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                <Icon icon="ic:round-error" className="text-lg" />
                {formik.errors.pipeline}
              </div>
            ) : null}
          </div>
          <div className="input-stage mb-3">
            <label htmlFor="stage" className="text-textColor block mb-2">
              Stage
            </label>
            <select
              name="stage"
              id="stage"
              className="input capitalize"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.stage}
            >
              {data?.map((item, i) => {
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
            {formik.touched.stage && formik.errors.stage ? (
              <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                <Icon icon="ic:round-error" className="text-lg" />
                {formik.errors.stage}
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

            <ReactDatePicker
              className="input"
              name="expectedClosingDate"
              selected={dealData.expectedClosingDate}
              minDate={new Date()}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.expectedClosingDate}
              // onChange={(date) => fillDealDetails("expectedClosingDate", date)}
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
          className="btn-outlined"
          disabled={isLoading}
          onClick={() => setIsOpen(false)}
          type="button"
        >
          cancel
        </button>
        <button
          // onClick={handleCreateDeal}
          disabled={isLoading}
          className="btn-filled"
          type="submit"
        >
          {isLoading ? "Loading..." : "add deal"}
        </button>
      </footer>
    </form>
  );
};

export default CreateDealForm;
