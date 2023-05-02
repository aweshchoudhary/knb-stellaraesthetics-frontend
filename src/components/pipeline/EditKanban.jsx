import React, { useEffect, useState } from "react";
import { useDeletePipelineMutation } from "../../redux/services/pipelineApi";
import Model from "../models/Model";
import CreatePipelineModel from "../models/CreatePipelineModel";
import EditStages from "../stage/EditStages";
import EditPipelineName from "./EditPipelineName";
import { Skeleton } from "@mui/material";
import { toast } from "react-toastify";

const EditKanban = ({ setIsOpen, pipeline, isLoading, isFetching }) => {
  console.log(pipeline);
  const [
    deletePipeline,
    { isLoading: isPiplineDeleting, isSuccess: isPipelineDeleteSuccess },
  ] = useDeletePipelineMutation();

  const [isCreatePipelineModelOpen, setIsCreatePipelineModelOpen] =
    useState(false);

  function handleStageEditViewClose() {
    setIsOpen(false);
  }
  async function handleDeletePipeline() {
    await deletePipeline(pipeline._id);
  }

  // useEffect(() => {
  //   // if (pipeline.length && isSuccess) {
  //   //   if (!savedPipelineIndex) {
  //   //     addPipeline(0);
  //   //     setActivePipeline(pipeline[0]);
  //   //   }
  //   //   setActivePipeline(pipeline[savedPipelineIndex]);
  //   // }
  // }, [pipeline, isSuccess]);

  useEffect(() => {
    if (isPipelineDeleteSuccess) {
      toast.success("Pipeline has been deleted");
    }
  }, [isPipelineDeleteSuccess]);

  return (
    pipeline && (
      <>
        <Model
          title={"Create Pipeline"}
          isOpen={isCreatePipelineModelOpen}
          setIsOpen={setIsCreatePipelineModelOpen}
        >
          <CreatePipelineModel setIsOpen={isCreatePipelineModelOpen} />
        </Model>
        <div
          className={!isLoading && !isFetching ? "opacity-100" : "opacity-50"}
        >
          <header className="h-[60px] flex items-center justify-between px-5 py-3 border-b">
            {pipeline ? (
              <EditPipelineName name={pipeline?.name} id={pipeline?._id} />
            ) : (
              <Skeleton width={200} height={"60px"} />
            )}
            <div className="flex items-center gap-2">
              <button
                className="btn-filled bg-red-600 border-red-600 btn-small"
                onClick={handleDeletePipeline}
              >
                {!isPiplineDeleting ? "delete pipeline" : "Deleting..."}
              </button>
              <button
                className="btn-filled btn-small"
                onClick={handleStageEditViewClose}
              >
                close
              </button>
            </div>
          </header>
          <section>
            {pipeline ? (
              <EditStages pipeline={pipeline} setIsEditStageView={setIsOpen} />
            ) : (
              <p className="p-10">
                No pipeline has been created yet.{" "}
                <button
                  className="underline"
                  onClick={() => setIsCreatePipelineModelOpen(true)}
                >
                  Create
                </button>
              </p>
            )}
          </section>
        </div>
      </>
    )
  );
};

export default EditKanban;
