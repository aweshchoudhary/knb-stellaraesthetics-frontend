import React from "react";
import { Header } from "@/modules/common";
import { PipelineTable } from "@/modules/pipeline";

const Pipeline = () => {
  return (
    <>
      <Header title={"Pipelines"} />
      <PipelineTable />
    </>
  );
};

export default Pipeline;
