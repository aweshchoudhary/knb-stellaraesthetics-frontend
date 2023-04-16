import { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch } from "react-redux";
import { updateClient } from "../../state/features/clientSlice";

const EditContact = ({ setIsOpen, data }) => {
  const [contactData, setContactData] = useState(
    data.original || {
      contactPerson: "",
      company: "",
      mobile: "",
      whatsapp: "",
      email: "",
    }
  );
  const [mobile, setMobile] = useState(data?.original?.mobile || "");
  const [whatsapp, setWhatsapp] = useState(data?.original?.whatsapp || "");
  const [sameNumber, setSameNumber] = useState(false);
  const region = navigator?.language?.split("-")[1];
  const dispatch = useDispatch();

  const [isChanged, setIsChanged] = useState(false);

  function handleSameNumber(e) {
    if (e.target.checked) {
      setSameNumber(true);
      return;
    }
    setSameNumber(false);
  }
  function fillContactData(name, value) {
    setContactData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  useEffect(() => {
    setContactData((prev) => {
      return {
        ...prev,
        mobile,
      };
    });
  }, [mobile]);

  useEffect(() => {
    setContactData((prev) => {
      return {
        ...prev,
        whatsapp: sameNumber ? mobile : whatsapp,
      };
    });
  }, [whatsapp, sameNumber]);

  useEffect(() => {
    const { contactPerson, company, mobile, whatsapp, email } = data.original;

    contactPerson !== contactData.contactPerson ||
    company !== contactData.company ||
    mobile !== contactData.mobile ||
    whatsapp !== contactData.whatsapp ||
    email !== contactData.email
      ? setIsChanged(true)
      : setIsChanged(false);
  }, [contactData]);

  return (
    <>
      <div className="p-5">
        <div className="mb-4">
          <label htmlFor="contactPerson" className="block mb-1">
            Contact Person Name
          </label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            className="input"
            placeholder="Update Contact Person Name"
            value={contactData.contactPerson}
            onChange={(e) => fillContactData(e.target.name, e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="company" className="block mb-1">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="input"
            placeholder="Update Company Name"
            value={contactData.company}
            onChange={(e) => fillContactData(e.target.name, e.target.value)}
          />
        </div>
        <div className="input-group mb-3 w-full">
          <label htmlFor="personName" className="text-textColor block  mb-2">
            Mobile
          </label>
          <PhoneInput
            placeholder="Mobile Number"
            value={mobile}
            defaultCountry={region}
            onChange={setMobile}
            className="input"
          />
        </div>
        <div className="input-group mb-3 w-full">
          <label htmlFor="personName" className="text-textColor block  mb-2">
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
          <div className="flex items-center gap-2">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="input"
              value={contactData.email}
              onChange={(e) => fillContactData(e.target.name, e.target.value)}
            />
          </div>
        </div>
      </div>
      <footer className="py-2 px-5 h-[60px] border-t flex items-center justify-end gap-2">
        <button
          className="btn-outlined"
          onClick={() => setIsOpen(false)}
          disabled={!isChanged}
        >
          Discard
        </button>
        <button className="btn-filled" disabled={!isChanged}>
          update
        </button>
      </footer>
    </>
  );
};

export default EditContact;
