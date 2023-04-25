import { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Label from "../deal/label/Label";
import { useGetStagesQuery } from "../../services/stageApi";
import { useCreateClientMutation } from "../../services/clientApi";
import { useCreateCardMutation } from "../../services/dealApi";
import { useGetPipelinesQuery } from "../../services/pipelineApi";
import Address from "../global/Address";

const CreateDealModel = ({ setIsOpen, pipelineId, activePipe }) => {
  const [createCard, { isLoading, isError, isSuccess }] =
    useCreateCardMutation();
  const [
    createClient,
    {
      data: clientData,
      isLoading: isClientLoading,
      isError: isClientError,
      isSuccess: isClientSuccess,
    },
  ] = useCreateClientMutation();
  const { data: stages } = useGetStagesQuery(pipelineId);
  const { data: pipelines } = useGetPipelinesQuery();

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

  const [activePipeline, setActivePipeline] = useState(activePipe);

  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameNumber, setSameNumber] = useState(false);
  const [address, setAddress] = useState({});

  const region = navigator?.language?.split("-")[1];

  async function handlCreateClient() {
    createClient({ ...clientDetails, address });
    setClientDetails({
      company: null,
      title: null,
      contactPerson: null,
      mobile: null,
      whatsapp: null,
      email: null,
      address: {},
    });
  }
  async function handleCreateDeal(clientId) {
    await createCard({ ...dealData, clientId });
    setDealData({
      value: { value: null, type: "inr" },
      stage: null,
      color: null,
      expectedClosingDate: null,
    });
    setIsOpen(false);
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
    if (!isClientLoading && isClientSuccess && clientData?.data?._id) {
      handleCreateDeal(clientData.data._id);
    }
  }, [isClientLoading, isClientSuccess]);

  useEffect(() => {
    if (pipelines?.length) {
      const index = pipelines.findIndex(
        (pipeline) => pipeline._id === pipelineId
      );
      setActivePipeline(pipelines[index]);
    }
  }, [pipelines]);

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
              {stages?.map((item, i) => {
                return (
                  <option key={i} className="text-black" value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="input-pipeline mb-3">
            <label htmlFor="stage" className="text-textColor block mb-2">
              Pipeline
            </label>
            <select
              name="stage"
              id="stage"
              className="input capitalize"
              onChange={(e) => fillDealDetails(e.target.name, e.target.value)}
            >
              {pipelines?.map((item, i) => {
                return item._id === pipelineId ? (
                  <option
                    key={i}
                    selected
                    defaultValue={i}
                    className="text-black"
                    value={i}
                  >
                    {item.name}
                  </option>
                ) : (
                  <option key={i} className="text-black" value={i}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="input-label mb-3">
            <label htmlFor="stage" className="text-textColor block mb-2">
              Label
            </label>
            <Label setLabel={setDealData} label={dealData.label} />
          </div>
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
          <div className="input-address mb-3">
            <Address address={address} setAddress={setAddress} />
          </div>
        </div>
      </div>
      <footer className="modal-footer">
        <button
          className="btn-outlined"
          disabled={isClientLoading || isLoading}
          onClick={() => setIsOpen(false)}
        >
          cancel
        </button>
        <button
          onClick={handlCreateClient}
          disabled={isClientLoading || isLoading}
          className="btn-filled"
        >
          {isClientLoading || isLoading ? "Loading..." : "add deal"}
        </button>
      </footer>
    </>
  );
};

export default CreateDealModel;
