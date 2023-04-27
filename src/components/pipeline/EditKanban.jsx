import { useEffect, useState } from "react";
import {
  useDeletePipelineMutation,
  useGetPipelinesQuery,
} from "../../services/pipelineApi";
import Model from "../models/Model";
import CreatePipelineModel from "../models/CreatePipelineModel";
import Loader from "../global/Loader";
import { useDispatch, useSelector } from "react-redux";
import EditStages from "../stage/EditStages";
import { addPipeline, removePipeline } from "../../state/features/globalSlice";
import EditPipelineName from "./EditPipelineName";
import { Skeleton } from "@mui/material";

const EditKanban = ({ setIsOpen }) => {
  const savedPipelineIndex = useSelector((state) => state.global.pipelineIndex);
  const [isStagesLength, setIsStagesLength] = useState(false);

  const {
    data = [],
    isLoading,
    isFetching,
    isSuccess,
    refetch: refetchPipelines,
  } = useGetPipelinesQuery();
  const [
    deletePipeline,
    { isLoading: isPiplineDeleting, isSuccess: isPipelineDeleteSuccess },
  ] = useDeletePipelineMutation();

  const dispatch = useDispatch();

  const [isCreatePipelineModelOpen, setIsCreatePipelineModelOpen] =
    useState(false);

  const [activePipeline, setActivePipeline] = useState(null);

  function handleStageEditViewClose() {
    setIsOpen(false);
  }
  async function handleDeletePipeline() {
    await deletePipeline(activePipeline._id);
    dispatch(removePipeline());
    refetchPipelines();
  }

  useEffect(() => {
    if (data.length && isSuccess) {
      if (!savedPipelineIndex) {
        addPipeline(0);
        setActivePipeline(data[0]);
      }
      setActivePipeline(data[savedPipelineIndex]);
    }
  }, [data, isSuccess]);

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
            {activePipeline ? (
              <EditPipelineName
                name={activePipeline?.name}
                id={activePipeline?._id}
              />
            ) : (
              <Skeleton width={200} height={"100%"} />
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
            {data.length && activePipeline ? (
              <EditStages
                setIsStagesLength={setIsStagesLength}
                pipeline={activePipeline}
                setIsEditStageView={setIsOpen}
              />
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
