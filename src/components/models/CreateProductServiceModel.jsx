import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Icon } from "@iconify/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useCreateProductServiceMutation } from "../../redux/services/productServiceApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Country } from "country-state-city";

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

const initialValues = {
  title: "",
  description: "",
  type: "product",
  image: null,
  rate: null,
  currency: "INR",
  qty: null,
  qty_type: null,
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  type: Yup.string().required("Type is required"),
  image: Yup.mixed(), //.nullable().required("Image is required"),
  rate: Yup.number()
    .nullable()
    .required("Rate is required")
    .positive("Must be positive"),
  currency: Yup.string(), //.required("Currency is required"),
  qty: Yup.number()
    .required("Quantity is required")
    .positive("Must be positive"),
  qty_type: Yup.string().required("Quantity type is required"),
});

const CreateProductServiceModel = ({ setIsOpen }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => handleCreateProductService(values),
  });
  const imageInputRef = useRef();
  const [type, setType] = useState(formik.values.type);
  const [selected, setSelected] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [createProductService, { isLoading, isError, isSuccess, error }] =
    useCreateProductServiceMutation();
  const loggedUserId = useSelector((state) => state.auth.loggedUserId);

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

  async function handleCreateProductService(values) {
    const data = new FormData();
    data.append("title", values.title);
    data.append("description", values.description);
    data.append("type", values.type);
    data.append("image", image);
    data.append("rate", values.rate);
    data.append("qty", values.qty);
    data.append("qty_type", values.qty_type);
    data.append("currency", values.currency);
    data.append("creator", loggedUserId);
    await createProductService(data);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product created successfully");
      setIsOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.success(error.data?.message);
  }, [isError]);

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (image) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setImageUrl(result);
        }
      };
      fileReader.readAsDataURL(image);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [image]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <section className="p-5">
        <h2 className="font-medium mb-3">
          Create New {type === "product" ? "Product" : "Services"}
        </h2>
        <div className="flex gap-3">
          <div className="w-1/3 shrink-0 p-1">
            <div className="h-[250px] hover:bg-paper rounded transition flex items-center justify-center relative w-full border">
              <input
                type="file"
                accept="image/*"
                id="image"
                name="image"
                className="absolute invisible"
                ref={imageInputRef}
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  formik.values.image = e.target.files[0].name;
                }}
                onBlur={formik.handleBlur}
              />
              {!image ? (
                <button
                  onClick={() => imageInputRef.current.click()}
                  className="flex text-borderColor items-center flex-col justify-center gap-2 h-full w-full"
                  type="button"
                >
                  <Icon icon="material-symbols:image" className="text-8xl" />
                  <p>Add Image</p>
                </button>
              ) : (
                <>
                  <img src={imageUrl} className="w-full object-contain" />
                </>
              )}
            </div>
            {image && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => imageInputRef.current.click()}
                  className="btn-outlined btn-small"
                  type="button"
                >
                  replace
                </button>
                <button
                  className="btn-outlined btn-small text-red-600"
                  onClick={() => {
                    setImage(null);
                    formik.values.image = null;
                  }}
                  type="button"
                >
                  remove
                </button>
              </div>
            )}
            {formik.touched.image && formik.errors.image ? (
              <div className="mt-2 text-red-600 text-sm flex items-center gap-1 w-full">
                <Icon icon="ic:round-error" className="text-lg" />
                {formik.errors.image}
              </div>
            ) : null}
          </div>
          <div className="flex-1">
            <div className="input-group mb-4">
              <div className="flex gap-2 items-stretch">
                <button
                  onClick={() => {
                    formik.values.type = "product";
                    setType("product");
                  }}
                  className={`btn-outlined cursor-pointer rounded-full btn-small ${
                    type === "product" ? "border-textColor" : ""
                  }`}
                  type="button"
                >
                  product
                </button>
                <button
                  onClick={() => {
                    formik.values.type = "service";
                    setType("service");
                  }}
                  className={`btn-outlined cursor-pointer rounded-full btn-small ${
                    type === "service" ? "border-textColor" : ""
                  }`}
                  type="button"
                >
                  service
                </button>
              </div>
            </div>
            <div className="input-group mb-4">
              <label htmlFor="title" className="mb-2 block">
                {type === "product" ? "Product" : "Services"} Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="input"
                placeholder="Title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="mt-2 text-red-600 text-sm flex items-center gap-1 w-full">
                  <Icon icon="ic:round-error" className="text-lg" />
                  {formik.errors.title}
                </div>
              ) : null}
            </div>

            <div className="input-group mb-4">
              <label htmlFor="description" className="mb-2 block">
                Description
              </label>
              <textarea
                type="text"
                name="description"
                id="description"
                className="input"
                placeholder="Description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="mt-2 text-red-600 text-sm flex items-center gap-1 w-full">
                  <Icon icon="ic:round-error" className="text-lg" />
                  {formik.errors.description}
                </div>
              ) : null}
            </div>
            <div className="input-group mb-4">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="number"
                  name="rate"
                  id="rate"
                  className="input w-[150px]"
                  placeholder="Rate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // value={+formik.values.rate}
                />

                <input
                  type="number"
                  name="qty"
                  id="qty"
                  className="input w-[100px]"
                  placeholder="Quantity"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // value={Number(formik.values.qty)}
                />

                <Select
                  name="qty_type"
                  id="qty_type"
                  className="flex-1"
                  classNamePrefix="select"
                  placeholder="Quantity Type"
                  onChange={(value) => {
                    setSelected(value);
                    formik.values.qty_type = value.value;
                  }}
                  onBlur={formik.handleBlur}
                  value={selected}
                  options={
                    type === "product"
                      ? validQtyProductType
                      : validQtyServiceType
                  }
                />
              </div>
              <div className="error">
                {formik.touched.rate && formik.errors.rate ? (
                  <div className="mt-2 text-red-600 text-sm flex items-center gap-1 w-full">
                    <Icon icon="ic:round-error" className="text-lg" />
                    {formik.errors.rate}
                  </div>
                ) : null}
                {formik.touched.qty && formik.errors.qty ? (
                  <div className="mt-2 text-red-600 text-sm flex items-center gap-1 w-full">
                    <Icon icon="ic:round-error" className="text-lg" />
                    {formik.errors.qty}
                  </div>
                ) : null}
                {formik.touched.qty_type && formik.errors.qty_type ? (
                  <div className="mt-2 text-red-600 text-sm flex items-center gap-1 w-full">
                    <Icon icon="ic:round-error" className="text-lg" />
                    {formik.errors.qty_type}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="input-group mb-4">
              <label htmlFor="title" className="mb-2 block">
                Currency
              </label>
              <Select
                name="currency"
                id="currency" // like inr,usd
                classNamePrefix="select"
                className="w-full"
                options={AllCountriesCurrencyData}
                onChange={(newCurrency) => {
                  formik.values.currency = newCurrency.value;
                  setCurrentCurrency(newCurrency);
                }}
                onBlur={formik.handleBlur}
                value={currentCurrency}
              />
            </div>
          </div>
        </div>
      </section>
      <footer className="modal-footer">
        <button
          disabled={isLoading}
          onClick={() => setIsOpen(false)}
          className="btn-outlined btn-small"
          type="button"
        >
          cancel
        </button>
        <button
          disabled={isLoading}
          className="btn-filled btn-small"
          type="submit"
        >
          {isLoading ? "Creating..." : "create"}
        </button>
      </footer>
    </form>
  );
};

export default CreateProductServiceModel;
