import React, { useEffect, useState } from "react";
import {
  useDeletePipelineMutation,
  useGetPipelineQuery,
} from "../../services/pipelineApi";
import Model from "../models/Model";
import CreatePipelineModel from "../models/CreatePipelineModel";
import EditStages from "../stage/EditStages";
import EditPipelineName from "./EditPipelineName";
import { Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditKanban = ({ setIsOpen }) => {
  const { id } = useParams();
  const {
    data = {},
    isLoading,
    isFetching,
    isSuccess,
    refetch: refetchPipelines,
  } = useGetPipelineQuery(id);
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
    await deletePipeline(data._id);
    refetchPipelines();
  }

  // useEffect(() => {
  //   // if (data.length && isSuccess) {
  //   //   if (!savedPipelineIndex) {
  //   //     addPipeline(0);
  //   //     setActivePipeline(data[0]);
  //   //   }
  //   //   setActivePipeline(data[savedPipelineIndex]);
  //   // }
  // }, [data, isSuccess]);

  useEffect(() => {
    if (isPipelineDeleteSuccess) {
      toast.success("Pipeline has been deleted");
    }
  }, [isPipelineDeleteSuccess]);

  return (
    isSuccess && (
      <>
        <Model
          title={"Create Pipeline"}
          isOpen={isCreatePipelineModelOpen}
          setIsOpen={setIsCreatePipelineModelOpen}
        >
          <CreatePipelineModel setIsOpen={isCreatePipelineModelOpen} />
        </Model>
        <div
          className={
            !isLoading && !isFetching && isSuccess
              ? "opacity-100"
              : "opacity-50"
          }
        >
          <header className="h-[60px] flex items-center justify-between px-5 py-3 border-b">
            {data ? (
              <EditPipelineName name={data?.name} id={data?._id} />
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
            {data ? (
              <EditStages pipeline={data} setIsEditStageView={setIsOpen} />
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
