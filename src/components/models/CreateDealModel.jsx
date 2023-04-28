import { useEffect, useState } from "react";
import Label from "../deal/label/Label";
import { useLazyGetStagesQuery } from "../../services/stageApi";
import { useCreateCardMutation } from "../../services/dealApi";
import { useGetPipelinesQuery } from "../../services/pipelineApi";
import "react-phone-number-input/style.css";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";

import CreateContactModel from "./CreateContactModel";
import { StepLabel } from "@mui/material";
import ReactDatePicker from "react-datepicker";

const steps = ["Create Contact", "Create Deal"];

const CreateDealModel = ({
  setIsOpen,
  pipelineId,
  activePipe,
  selectedData = [],
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [selectedContacts, setSelectedContacts] = useState(
    selectedData.length ? selectedData : []
  );

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = (selectedData) => {
    if (selectedData) {
      setSelectedContacts(selectedData);
    }
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  return (
    <section className="container h-full">
      <Box sx={{ width: "100%" }} className="pt-5">
        <Stepper nonLinear activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepLabel color="inherit">{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box>
          {activeStep === 0 ? (
            <CreateContactModel
              setIsOpen={setIsOpen}
              handleComplete={handleComplete}
              selectedContacts={selectedContacts}
              setSelectedContacts={setSelectedContacts}
            />
          ) : (
            <CreateDeal
              pipelineId={pipelineId}
              activePipe={activePipe}
              selectedContacts={selectedContacts}
              setSelectedContacts={setSelectedContacts}
              setIsOpen={setIsOpen}
              handleBack={handleBack}
              activeStep={activeStep}
            />
          )}
        </Box>
      </Box>
    </section>
  );
};

const CreateDeal = ({ setIsOpen, pipelineId, selectedContacts }) => {
  const [getStages, { data = [] }] = useLazyGetStagesQuery();
  const [dealData, setDealData] = useState({
    title: "",
    value: "",
    currentStage: "",
    label: "",
    expectedClosingDate: new Date(),
  });

  const [pipeId, setPipeId] = useState(pipelineId);

  const [createCard, { isLoading, isError, error, isSuccess }] =
    useCreateCardMutation();

  const { data: pipelines } = useGetPipelinesQuery();

  async function handleCreateDeal() {
    const contacts = selectedContacts.map((item) => item.value);
    const newCard = { ...dealData, contacts };

    await createCard(newCard);
    setIsOpen(false);
  }

  function fillDealDetails(name, value) {
    setDealData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  const fetchStages = async (pipeId) => {
    await getStages(pipeId);
  };
  useEffect(() => {
    if (pipeId) fetchStages(pipeId);
  }, [pipeId]);

  useEffect(() => {
    if (!pipeId && pipelines?.length) fetchStages(pipelines[0]._id);
  }, [pipeId, pipelines]);

  useEffect(() => {
    if (isSuccess) toast.success("Deal has been created");
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error(error);
  }, [isError]);

  useEffect(() => {
    if (data.length) {
      setDealData((prev) => ({
        ...prev,
        currentStage: data[0]._id,
      }));
    }
  }, [data]);

  return (
    <>
      <section className="container h-full">
        <div className="h-full p-5">
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
          <div className="input-pipeline mb-3">
            <label htmlFor="stage" className="text-textColor block mb-2">
              Pipeline
            </label>
            <select
              name="pipeline"
              id="pipeline"
              className="input capitalize"
              onChange={(e) => setPipeId(e.target.value)}
            >
              {pipelines?.map((item, i) => {
                return item._id === pipelineId ? (
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
              {data?.map((item, i) => {
                return item._id === dealData.currentStage ? (
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
            {/* <input
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
            /> */}
            <ReactDatePicker
              className="input"
              name="expectedClosingDate"
              selected={dealData.expectedClosingDate}
              onChange={(date) => fillDealDetails("expectedClosingDate", date)}
              minDate={new Date()}
            />
          </div>
        </div>
      </section>
      <footer className="modal-footer">
        <button
          className="btn-outlined"
          disabled={isLoading}
          onClick={() => setIsOpen(false)}
        >
          cancel
        </button>
        <button
          onClick={handleCreateDeal}
          disabled={isLoading}
          className="btn-filled"
        >
          {isLoading ? "Loading..." : "add deal"}
        </button>
      </footer>
    </>
  );
};

export default CreateDealModel;
