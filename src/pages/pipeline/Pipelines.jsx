import React from "react";
import Header from "../../components/global/Header";
import PipelineTable from "../../components/tables/PipelineTable";

const Pipeline = () => {
  return (
    <>
      <Header title={"Pipelines"} />
      <PipelineTable />
    </>
  );
};

export default Pipeline;
