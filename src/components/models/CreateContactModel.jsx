import PhoneInput from "react-phone-number-input";
import {
  useCreateClientMutation,
  useLazyGetClientsQuery,
} from "../../services/clientApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { Icon } from "@iconify/react";

const CreateContactModel = ({
  setIsOpen,
  handleComplete,
  selectedContacts,
  setSelectedContacts,
}) => {
  const [createNewContactSectionDisplay, setCreateNewContactSectionDisplay] =
    useState(false);

  function handleAddClient() {
    handleComplete && handleComplete(selectedContacts);
  }

  return (
    <section>
      <div className="p-5 pb-0">
        <div className="Search-Contacts mb-3">
          <label className="text-textColor block  mb-2">Search Contacts</label>
          <SearchContact
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
          />
        </div>
      </div>
      {!createNewContactSectionDisplay && (
        <button
          type="button"
          className="btn-filled btn-small m-5"
          onClick={() => setCreateNewContactSectionDisplay(true)}
        >
          <Icon icon="uil:plus" className="text-lg" /> Contact
        </button>
      )}

      {createNewContactSectionDisplay && (
        <CreateContactForm
          setSelectedContacts={setSelectedContacts}
          setIsOpen={setCreateNewContactSectionDisplay}
        />
      )}
      <footer className="modal-footer">
        <button
          className="btn-outlined"
          type="button"
          // disabled={isLoading}
          onClick={() => setIsOpen(false)}
        >
          cancel
        </button>
        <button
          // disabled={isLoading}
          className="btn-filled"
          onClick={handleAddClient}
          disabled={!selectedContacts?.length}
        >
          add contacts
        </button>
      </footer>
    </section>
  );
};

const validationSchema = Yup.object({
  contactPerson: Yup.string()
    .min(3, "Must be at least 3 characters")
    .required("Required"),
  company: Yup.string().min(3, "Must be at least 3 characters"),
  mobile: Yup.string().min(10, "Must be at least 10 digits"),
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

export const CreateContactForm = ({ setIsOpen, setSelectedContacts }) => {
  let clientDetails = {
    company: "",
    contactPerson: "",
    mobile: "",
    whatsapp: "",
    email: "",
  };

  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameNumber, setSameNumber] = useState(false);
  const [address, setAddress] = useState({});

  const [createClient, { isLoading, isError, isSuccess, error }] =
    useCreateClientMutation();

  const region = navigator?.language?.split("-")[1];

  async function handlCreateClient(values) {
    if (!clientDetails.mobile.length && !clientDetails.whatsapp.length) {
      return toast.error("Please enter Mobile or Whatsapp Number");
    }

    const newClientData = {
      ...values,
      mobile: clientDetails.mobile,
      whatsapp: clientDetails.whatsapp,
      address,
    };
    console.log(newClientData);
    const res = await createClient(newClientData);

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

  // function fillClientDetails(name, value) {
  //   setClientDetails((prev) => {
  //     return {
  //       ...prev,
  //       [name]: value,
  //     };
  //   });
  // }
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
    clientDetails = {
      ...clientDetails,
      mobile,
    };
  }, [mobile]);

  useEffect(() => {
    clientDetails = {
      ...clientDetails,
      whatsapp: sameNumber ? mobile : whatsapp,
    };
  }, [whatsapp, sameNumber]);

  useEffect(() => {
    if (isSuccess) toast.success("Contact has been created");
  }, [isSuccess]);
  useEffect(() => {
    if (isError) toast.error(error);
  }, [isError]);

  return (
    <Formik
      initialValues={clientDetails}
      onSubmit={handlCreateClient}
      validationSchema={validationSchema}
      className="container h-full"
    >
      {(formik) => (
        <Form className="h-full">
          <section className="p-5 pt-0">
            <h2 className="text-xl font-medium mb-4 border-b py-3">
              Create New Contact
            </h2>
            <div className="input-fname mb-3">
              <label
                htmlFor="personName"
                className="text-textColor block  mb-2"
              >
                Contact Person
              </label>
              <Field
                type="text"
                name="contactPerson"
                id="contactPerson"
                placeholder="Full Name"
                className="input"
                // value={clientDetails.contactPerson}
                // onChange={(e) => fillClientDetails(e.target.name, e.target.value)}
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
              <label
                htmlFor="organization"
                className="text-textColor block mb-2"
              >
                Company
              </label>
              <Field
                type="text"
                name="company"
                id="company"
                placeholder="Company Name"
                className="input"
                // value={clientDetails.company}
                // onChange={(e) => fillClientDetails(e.target.name, e.target.value)}
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
              <label
                htmlFor="personName"
                className="text-textColor block  mb-2"
              >
                Mobile
              </label>
              <PhoneInput
                placeholder="Mobile Number"
                value={mobile}
                defaultCountry={region}
                onChange={setMobile}
                className="input"
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
              <label
                htmlFor="personName"
                className="text-textColor block  mb-2"
              >
                Whatsapp Number
              </label>
              <PhoneInput
                placeholder="Whatsapp Number"
                value={sameNumber ? mobile : whatsapp}
                disabled={sameNumber}
                defaultCountry={region}
                onChange={setWhatsapp}
                className="input"
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
              <Field
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
              <label
                htmlFor="personName"
                className="text-textColor block  mb-2"
              >
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="input"
                // value={clientDetails.email}
                // onChange={(e) => fillClientDetails(e.target.name, e.target.value)}
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
            <div className="input-address mb-3">
              <div className="text-sm">
                <label
                  htmlFor="personName"
                  className="text-textColor block  mb-2"
                >
                  Address
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <Field
                    type="line1"
                    name="line1"
                    id="line1"
                    placeholder="Address Line 1"
                    className="input"
                    // value={address?.line1}
                    // onChange={(e) =>
                    //   fillAddressInputs(e.target.name, e.target.value)
                    // }
                  />
                  {formik.touched.address?.line1 &&
                  formik.errors.address?.line1 ? (
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
                  <Field
                    type="line2"
                    name="line2"
                    id="line2"
                    placeholder="Address Line 2"
                    className="input"
                    // value={address.line2}
                    // onChange={(e) =>
                    //   fillAddressInputs(e.target.name, e.target.value)
                    // }
                  />
                  {formik.touched.address?.line2 &&
                  formik.errors.address?.line2 ? (
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
                      value={currentCountry}
                      placeholder="Country"
                      className="mb-2"
                      onChange={(value) => {
                        setCurrentCountry(value);
                        setAddress((prev) => {
                          return {
                            ...prev,
                            country: value,
                          };
                        });
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
                      value={currentState}
                      onChange={(value) => {
                        setAddress((prev) => {
                          return {
                            ...prev,
                            state: value,
                          };
                        });
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
                      onChange={(value) => {
                        setAddress((prev) => {
                          return {
                            ...prev,
                            city: value,
                          };
                        });
                        setCurrentCity(value);
                      }}
                      className="mb-2"
                    />
                    {formik.touched.address?.city &&
                    formik.errors.address?.city ? (
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
        </Form>
      )}
    </Formik>
  );
};

const SearchContact = ({ selectedContacts, setSelectedContacts }) => {
  const [searchClient, { isLoading, isFetching }] = useLazyGetClientsQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedContacts, setSearchedContacts] = useState([]);

  const handleChange = async (options) => {
    setSelectedContacts(options);
  };

  useEffect(() => {
    const fetchContacts = async (query) => {
      const res = await searchClient({ params: { search: query } });
      if (res.data) {
        const contacts = res.data.map((item) => ({
          label: `${item.contactPerson} - ${item.company}`,
          value: item._id,
        }));
        setSearchedContacts(contacts);
      }
    };
    searchQuery.length > 3 && fetchContacts(searchQuery);
  }, [searchQuery]);
  return (
    <Select
      id="deal"
      name="deal"
      label="deal"
      isMulti
      value={selectedContacts}
      isLoading={isFetching || isLoading}
      options={searchedContacts}
      placeholder="Search Contacts"
      onChange={handleChange}
      onInputChange={(value) => setSearchQuery(value)}
      inputValue={searchQuery}
      className="mb-2"
    ></Select>
  );
};

export default CreateContactModel;
