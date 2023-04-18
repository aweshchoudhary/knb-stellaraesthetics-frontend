import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createDeal } from "../../state/features/dealFeatures/dealSlice";
import { createClient } from "../../state/features/clientSlice";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Label from "../deal/label/Label";
import { addTempItemToStage } from "../../state/features/stageSlice";

const AddDeal = ({ setIsOpen }) => {
  const { loading, data } = useSelector((state) => state.deals);
  const stages = useSelector((state) => state.stages);
  const client = useSelector((state) => state.client);
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);

  const [dealData, setDealData] = useState({
    title: "",
    stage: "",
    value: { value: "", type: "inr" },
    label: "",
    expectedClosingDate: "",
  });

  const [clientDetails, setClientDetails] = useState({
    company: "",
    contactPerson: "",
    mobile: "",
    whatsapp: "",
    email: "",
  });

  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameNumber, setSameNumber] = useState(false);

  const region = navigator?.language?.split("-")[1];

  function handleAddClient() {
    dispatch(createClient(clientDetails));
    setClientDetails({
      company: null,
      title: null,
      contactPerson: null,
      mobile: null,
      whatsapp: null,
      email: null,
    });
    setIsFetching(true);
  }
  function handleAddDeal(clientId) {
    dispatch(createDeal({ ...dealData, clientId }));
    setDealData({
      value: { value: null, type: "inr" },
      stage: null,
      color: null,
      expectedClosingDate: null,
    });
  }

  function fillClientDetails(name, value) {
    setClientDetails((prev) => {
      return {
        ...prev,
        [name]: value,
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
    setClientDetails((prev) => {
      return {
        ...prev,
        mobile,
      };
    });
  }, [mobile]);

  useEffect(() => {
    setClientDetails((prev) => {
      return {
        ...prev,
        whatsapp: sameNumber ? mobile : whatsapp,
      };
    });
  }, [whatsapp, sameNumber]);

  useEffect(() => {
    console.log("working");
    if (isFetching && client.data._id) {
      console.log("working");
      handleAddDeal(client.data._id);
    }
  }, [client.loading, client.data, client.success]);

  // After Add Deal Function
  useEffect(() => {
    if (isFetching && data) {
      dispatch(addTempItemToStage({ stageId: dealData.stage, item: data._id }));
      setIsFetching(false);
      setIsOpen(false);
    }
  }, [data, isFetching]);

  return (
    <>
      <div className="container sm:flex h-full">
        <div className="sm:w-1/2 shrink-0 h-full p-5">
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
              value={clientDetails.contactPerson}
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
              value={clientDetails.company}
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
              value={dealData.title}
              onChange={(e) => fillDealDetails(e.target.name, e.target.value)}
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
          <div className="input-stage mb-3">
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
          </div>
          {/* <StageSlider /> */}
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
                value={clientDetails.email}
                onChange={(e) =>
                  fillClientDetails(e.target.name, e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
      <footer className="modal-footer">
        <button
          className="btn-outlined"
          disabled={loading || client?.loading}
          onClick={() => setIsOpen(false)}
        >
          cancel
        </button>
        <button
          onClick={handleAddClient}
          disabled={loading || client?.loading}
          className="btn-filled"
        >
          {loading || client?.loading ? "Loading..." : "add deal"}
        </button>
      </footer>
    </>
  );
};

export default AddDeal;
