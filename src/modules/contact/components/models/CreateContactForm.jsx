import React, { Suspense, useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import { useCreateContactMutation } from "@/redux/services/contactApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";

let contactDetails = {
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
    initialValues: contactDetails,
    validationSchema,
    onSubmit: (values) => handlCreateContact(values),
  });

  const [createContact, { isLoading, isError, isSuccess, error }] =
    useCreateContactMutation();

  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameNumber, setSameNumber] = useState(false);

  const region = navigator?.language?.split("-")[1];

  async function handlCreateContact(values) {
    if (!formik.values.mobile.length && !formik.values.whatsapp.length) {
      return toast.error("Please enter Mobile or Whatsapp Number");
    }

    const res = await createContact(values);

    if (setSelectedContacts && res.data) {
      setSelectedContacts((prev) => [
        ...prev,
        {
          label: `${res.data.contactPerson} - ${res.data.company}`,
          value: res.data._id,
        },
      ]);
    }
    setIsOpen(false);
  }

  function handleSameNumber(e) {
    if (e.target.checked) {
      setSameNumber(true);
      return;
    }
    setSameNumber(false);
  }

  useEffect(() => {
    formik.values.mobile = mobile;
  }, [mobile]);

  useEffect(() => {
    formik.values.whatsapp = sameNumber ? mobile : whatsapp;
  }, [whatsapp, sameNumber]);

  useEffect(() => {
    if (isSuccess) toast.success("Contact has been created");
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error(error);
  }, [isError]);

  return (
    <Suspense>
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
                <Icon
                  icon="material-symbols:error-rounded"
                  className="text-xl"
                />{" "}
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
                <Icon
                  icon="material-symbols:error-rounded"
                  className="text-xl"
                />{" "}
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
                <Icon
                  icon="material-symbols:error-rounded"
                  className="text-xl"
                />{" "}
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
                <Icon
                  icon="material-symbols:error-rounded"
                  className="text-xl"
                />{" "}
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
                <Icon
                  icon="material-symbols:error-rounded"
                  className="text-xl"
                />{" "}
                {formik.errors.email}
              </div>
            ) : null}
          </div>
        </section>
        <footer className="flex items-center p-5 pt-0 gap-2">
          <button
            className="btn-outlined btn-small"
            type="button"
            disabled={isLoading}
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
    </Suspense>
  );
};

export default CreateContactForm;
