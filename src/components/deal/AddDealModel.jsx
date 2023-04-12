import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createDeal } from "../../state/features/dealFeatures/dealSlice";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Label from "./label/Label";
import StageSlider from "./StageSlider";

const AddDeal = ({ setIsOpen }) => {
  const { loading } = useSelector((state) => state.deals);
  const dispatch = useDispatch();

  const [dealData, setDealData] = useState({
    clientDetails: {
      company: null,
      title: null,
      contactPerson: null,
      mobile: null,
      whatsapp: null,
      email: null,
    },
    value: { value: null, type: "inr" },
    stage: null,
    label: null,
    expectedClosingDate: null,
  });
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameNumber, setSameNumber] = useState(false);

  const region = navigator?.language?.split("-")[1];

  function handleAddDeal() {
    dispatch(createDeal(dealData));
    setDealData({
      clientDetails: {
        company: null,
        title: null,
        contactPerson: null,
        phone: { number: null, prefix: "91", type: "work" },
        email: { email: null, type: "work" },
      },
      value: { value: null, type: "inr" },
      stage: null,
      color: null,
      expectedClosingDate: null,
    });
    setIsOpen(false);
  }
  function fillClientDetails(name, value) {
    setDealData((prev) => {
      return {
        ...prev,
        clientDetails: {
          ...prev.clientDetails,
          [name]: value,
        },
      };
    });
  }
  function fillDealDetails(name, value) {
    setDealData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }
  function handleSameNumber(e) {
    if (e.target.checked) {
      setSameNumber(true);
      return;
    }
    setSameNumber(false);
  }

  useEffect(() => {
    setDealData((prev) => {
      return {
        ...prev,
        clientDetails: {
          ...prev.clientDetails,
          mobile,
        },
      };
    });
  }, [mobile]);

  useEffect(() => {
    setDealData((prev) => {
      return {
        ...prev,
        clientDetails: {
          ...prev.clientDetails,
          whatsapp: sameNumber ? mobile : whatsapp,
        },
      };
    });
  }, [whatsapp]);

  return (
    <>
      <div className="container sm:flex h-full">
        <div className="sm:w-1/2 shrink-0 border-r h-full p-3">
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
              onChange={(e) => fillClientDetails(e.target.name, e.target.value)}
            />
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
              onChange={(e) => fillClientDetails(e.target.name, e.target.value)}
            />
          </div>
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
              onChange={(e) => fillClientDetails(e.target.name, e.target.value)}
            />
          </div>
          <div className="input-value mb-3">
            <label htmlFor="amount-value" className="text-textColor block mb-2">
              Value
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="value"
                id="amount-value"
                placeholder="Value"
                className="input w-1/2"
                onChange={(e) =>
                  fillDealDetails(e.target.name, {
                    value: +e.target.value,
                    type: dealData.value.type,
                  })
                }
              />
              <select
                name="value"
                id="value-type" // like inr,usd
                className="input w-1/2"
                onChange={(e) =>
                  fillDealDetails(e.target.name, {
                    value: dealData.value.value,
                    type: e.target.value,
                  })
                }
              >
                <option defaultValue={"inr"} className="text-black" value="inr">
                  Indian Rupee
                </option>
                <option className="text-black" value="dollar">
                  US Dollar
                </option>
                <option className="text-black" value="inr">
                  Indian Rupee
                </option>
              </select>
            </div>
          </div>
          {/* <div className="input-stage mb-3">
            <label htmlFor="stage" className="text-textColor block mb-2">
              Stage
            </label>
            <select
              name="stage"
              id="stage"
              className="input capitalize"
              onChange={(e) => fillDealDetails(e.target.name, e.target.value)}
            >
              <option className="text-black" defaultValue={""}>
                Select Stage
              </option>
              {stages?.data?.map((item, i) => {
                return (
                  <option key={i} className="text-black" value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div> */}
          <StageSlider />
          <Label setLabel={setDealData} label={dealData.label} />
          <div className="input-close-date mb-3">
            <label htmlFor="close-date" className="text-textColor block mb-2">
              Expected Close Date
            </label>
            <input
              type="date"
              id="close-date"
              name="expectedClosingDate"
              onChange={(e) =>
                fillDealDetails(
                  e.target.name,
                  new Date(e.target.value).toISOString()
                )
              }
              className="input"
            />
          </div>
        </div>
        <div className="flex-1 h-full p-3">
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
                onChange={(e) =>
                  fillClientDetails(e.target.name, e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
      <footer className="py-2 px-5 h-[60px] border-t flex items-center justify-end gap-2">
        <button
          className="btn-outlined"
          disabled={loading}
          onClick={() => setIsOpen(false)}
        >
          cancel
        </button>
        <button
          onClick={handleAddDeal}
          disabled={loading}
          className="btn-filled"
        >
          {loading ? "Loading..." : "add deal"}
        </button>
      </footer>
    </>
  );
};

export default AddDeal;
