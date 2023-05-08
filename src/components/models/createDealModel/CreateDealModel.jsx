import React, { useState } from "react";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";

import CreateContactModel from "../createContactModel/CreateContactModel";
import { StepLabel } from "@mui/material";
import CreateDealForm from "./CreateDealForm";

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
            <CreateDealForm
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

export default CreateDealModel;
