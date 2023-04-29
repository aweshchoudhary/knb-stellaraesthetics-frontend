import PhoneInput from "react-phone-number-input";
import { useCreateClientMutation } from "../../../services/clientApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { Icon } from "@iconify/react";

let clientDetails = {
  company: "",
  contactPerson: "",
  mobile: "",
  whatsapp: "",
  email: "",
  address: {
    line1: "",
    line2: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
  },
};

const validationSchema = Yup.object({
  contactPerson: Yup.string()
    .min(3, "Must be at least 3 characters")
    .required("Required"),
  company: Yup.string().min(3, "Must be at least 3 characters"),
  mobile: Yup.string()
    .min(10, "Must be at least 10 digits")
    .required("Mobile is required"),
  whatsapp: Yup.string().min(10, "Must be at least 10 digits"),
  email: Yup.string().email("Invalid email address"),
  address: Yup.object({
    line1: Yup.string(),
    line2: Yup.string(),
    country: Yup.object(),
    city: Yup.object(),
    state: Yup.object(),
    postalCode: Yup.number()
      .typeError("Must be a number")
      .positive("Must be a positive number")
      .integer("Must be an integer"),
  }),
});

const CreateContactForm = ({ setIsOpen, setSelectedContacts }) => {
  // Validation
  const formik = useFormik({
    initialValues: clientDetails,
    validationSchema,
    onSubmit: (values) => handlCreateClient(values),
  });

  const [createClient, { isLoading, isError, isSuccess, error }] =
    useCreateClientMutation();

  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameNumber, setSameNumber] = useState(false);

  const region = navigator?.language?.split("-")[1];

  async function handlCreateClient(values) {
    if (!formik.values.mobile.length && !formik.values.whatsapp.length) {
      return toast.error("Please enter Mobile or Whatsapp Number");
    }

    const res = await createClient(values);

    if (setSelectedContacts && res.data) {
      setSelectedContacts((prev) => [
        ...prev,
        {
          label: `${res.data.contactPerson} - ${res.data.company}`,
          value: res.data._id,
        },
      ]);
    }
    handleClearForm();
  }

  function handleClearForm() {
    clientDetails = {
      company: "",
      contactPerson: "",
      mobile: "",
      whatsapp: "",
      email: "",
    };
  }

  function handleSameNumber(e) {
    if (e.target.checked) {
      setSameNumber(true);
      return;
    }
    setSameNumber(false);
  }

  const [currentCountry, setCurrentCountry] = useState(null);
  const [currentState, setCurrentState] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);

  const countries = Country.getAllCountries();

  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.isoCode,
    ...country,
  }));

  const updatedStates = (countryCode) =>
    State.getStatesOfCountry(countryCode).map((state) => ({
      label: state.name,
      value: state.isoCode,
      ...state,
    }));
  const updatedCities = (countryCode, stateCode) =>
    City.getCitiesOfState(countryCode, stateCode).map((city) => ({
      label: city.name,
      value: city.id,
      ...city,
    }));

  useEffect(() => {
    formik.values.mobile = mobile;
  }, [mobile]);

  useEffect(() => {
    formik.values.whatsapp = sameNumber ? mobile : whatsapp;
  }, [whatsapp, sameNumber]);

  useEffect(() => {
    formik.values.address.country = currentCountry || "";
  }, [currentCountry]);

  useEffect(() => {
    formik.values.address.state = currentState || "";
  }, [currentState]);

  useEffect(() => {
    formik.values.address.city = currentCity || "";
  }, [currentCity]);

  useEffect(() => {
    if (isSuccess) toast.success("Contact has been created");
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error(error);
  }, [isError]);

  return (
    <form onSubmit={formik.handleSubmit} className="h-full">
      <section className="p-5 pt-0">
        <h2 className="text-xl font-medium mb-4 border-b py-3">
          Create New Contact
        </h2>
        <div className="input-fname mb-3">
          <label htmlFor="personName" className="text-textColor block  mb-2">
            Contact Person
          </label>
          <input
            type="text"
            name="contactPerson"
            id="contactPerson"
            placeholder="Full Name"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.contactPerson}
          />
          {formik.touched.contactPerson && formik.errors.contactPerson ? (
            <div className="text-sm mt-2 text-red-600 flex items-center gap-2">
              <Icon icon="material-symbols:error-rounded" className="text-xl" />{" "}
              {formik.errors.contactPerson}
            </div>
          ) : null}
        </div>
        <div className="input-organization mb-3">
          <label htmlFor="organization" className="text-textColor block mb-2">
            Company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            placeholder="Company Name"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.company}
          />
          {formik.touched.company && formik.errors.company ? (
            <div className="text-sm mt-2 text-red-600 flex items-center gap-2">
              <Icon icon="material-symbols:error-rounded" className="text-xl" />{" "}
              {formik.errors.company}
            </div>
          ) : null}
        </div>
        <div className="input-group mb-3 w-full">
          <label htmlFor="personName" className="text-textColor block  mb-2">
            Mobile
          </label>
          <PhoneInput
            id="mobile"
            name="mobile"
            placeholder="Mobile Number"
            defaultCountry={region}
            className="input"
            onBlur={formik.handleBlur}
            value={mobile}
            onChange={setMobile}
          />
          {formik.touched.mobile && formik.errors.mobile ? (
            <div className="text-sm mt-2 text-red-600 flex items-center gap-2">
              <Icon icon="material-symbols:error-rounded" className="text-xl" />{" "}
              {formik.errors.mobile}
            </div>
          ) : null}
        </div>
        <div className="input-group mb-3 w-full">
          <label htmlFor="personName" className="text-textColor block  mb-2">
            Whatsapp Number
          </label>
          <PhoneInput
            id="whatsapp"
            name="whatsapp"
            placeholder="Whatsapp Number"
            disabled={sameNumber}
            defaultCountry={region}
            className="input"
            onChange={setWhatsapp}
            onBlur={formik.handleBlur}
            value={sameNumber ? mobile : whatsapp}
          />
          {formik.touched.whatsapp && formik.errors.whatsapp ? (
            <div className="text-sm mt-2 text-red-600 flex items-center gap-2">
              <Icon icon="material-symbols:error-rounded" className="text-xl" />{" "}
              {formik.errors.whatsapp}
            </div>
          ) : null}
        </div>
        <div className="input-group mb-3 w-full flex items-center gap-2">
          <input
            type="checkbox"
            name="same-number"
            id="same-number"
            onChange={handleSameNumber}
            checked={sameNumber}
          />
          <label htmlFor="same-number" className="text-textColor block ">
            Same as mobile number
          </label>
        </div>
        <div className="input-group mb-3">
          <label htmlFor="personName" className="text-textColor block  mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-sm mt-2 text-red-600 flex items-center gap-2">
              <Icon icon="material-symbols:error-rounded" className="text-xl" />{" "}
              {formik.errors.email}
            </div>
          ) : null}
        </div>
        <div className="input-address mb-3">
          <div className="text-sm">
            <label htmlFor="personName" className="text-textColor block  mb-2">
              Address
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="line1"
                name="address.line1"
                id="line1"
                placeholder="Address Line 1"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address.line1}
              />
              {formik.touched.address?.line1 && formik.errors.address?.line1 ? (
                <div className="text-sm mt-2 text-red-600 flex items-center gap-2">
                  <Icon
                    icon="material-symbols:error-rounded"
                    className="text-xl"
                  />{" "}
                  {formik.errors.address?.line1}
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="line2"
                name="address.line2"
                id="line2"
                placeholder="Address Line 2"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address.line2}
              />
              {formik.touched.address?.line2 && formik.errors.address?.line2 ? (
                <div className="text-sm mt-2 text-red-600 flex items-center gap-2">
                  <Icon
                    icon="material-symbols:error-rounded"
                    className="text-xl"
                  />{" "}
                  {formik.errors.address?.line2}
                </div>
              ) : null}
            </div>
            <div>
              <div>
                <Select
                  id="country"
                  name="country"
                  label="country"
                  options={updatedCountries}
                  placeholder="Country"
                  className="mb-2"
                  onBlur={formik.handleBlur}
                  value={currentCountry}
                  onChange={(value) => {
                    setCurrentCountry(value);
                  }}
                />
                {formik.touched.address?.country &&
                formik.errors.address?.country ? (
                  <div className="text-sm mt-2 text-red-600 flex items-center gap-2">
                    <Icon
                      icon="material-symbols:error-rounded"
                      className="text-xl"
                    />{" "}
                    {formik.errors.address?.country}
                  </div>
                ) : null}
                <Select
                  id="state"
                  name="state"
                  options={updatedStates(currentCountry?.value || null)}
                  onBlur={formik.handleBlur}
                  value={currentState}
                  onChange={(value) => {
                    setCurrentState(value);
                  }}
                  placeholder="State"
                  className="mb-2"
                />
                {formik.touched.address?.state &&
                formik.errors.address?.state ? (
                  <div className="text-sm mt-2 text-red-600 flex items-center gap-2">
                    <Icon
                      icon="material-symbols:error-rounded"
                      className="text-xl"
                    />{" "}
                    {formik.errors.address?.state}
                  </div>
                ) : null}
                <Select
                  id="city"
                  name="city"
                  placeholder="City"
                  options={updatedCities(
                    currentCountry?.value,
                    currentState?.value
                  )}
                  value={currentCity}
                  onBlur={formik.handleBlur}
                  onChange={(value) => {
                    setCurrentCity(value);
                  }}
                  className="mb-2"
                />
                {formik.touched.address?.city && formik.errors.address?.city ? (
                  <div className="text-sm mt-2 text-red-600 flex items-center gap-2">
                    <Icon
                      icon="material-symbols:error-rounded"
                      className="text-xl"
                    />{" "}
                    {formik.errors.address?.city}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="flex items-center p-5 pt-0 gap-2">
        <button
          className="btn-outlined btn-small"
          type="button"
          // disabled={isLoading}
          onClick={() => setIsOpen(false)}
        >
          cancel
        </button>
        <button
          disabled={isLoading}
          type="submit"
          className="btn-filled btn-small"
        >
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              <Icon icon="uil:plus" className="text-lg" /> New Contact
            </>
          )}
        </button>
      </footer>
    </form>
  );
};

export default CreateContactForm;
