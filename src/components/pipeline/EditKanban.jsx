import { useEffect, useState } from "react";
import {
  useDeletePipelineMutation,
  useGetPipelinesQuery,
} from "../../services/pipelineApi";
import Model from "../models/Model";
import CreatePipelineModel from "../models/CreatePipelineModel";
import Loader from "../global/Loader";
import { useSelector } from "react-redux";
import EditStages from "../stage/EditStages";

const EditKanban = ({ setIsOpen }) => {
  const savedPipelineIndex = useSelector((state) => state.global.pipelineIndex);
  const {
    data = [],
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useGetPipelinesQuery();
  const [
    deletePipeline,
    { isLoading: isPiplineDeleting, isSuccess: isPipelineDeleteSuccess },
  ] = useDeletePipelineMutation();

  const [isCreatePipelineModelOpen, setIsCreatePipelineModelOpen] =
    useState(false);
  const [activePipeline, setActivePipeline] = useState(null);

  function handleStageEditViewClose() {
    setIsOpen(false);
  }
  async function handleDeletePipeline(id) {
    await deletePipeline(id);
    refetch();
  }

  useEffect(() => {
    if (data.length && isSuccess) {
      setActivePipeline(data[savedPipelineIndex]);
    }
  }, [data, isSuccess]);

  return !isLoading && !isFetching && isSuccess ? (
    <>
      <Model
        title={"Create Pipeline"}
        isOpen={isCreatePipelineModelOpen}
        setIsOpen={setIsCreatePipelineModelOpen}
      >
        <CreatePipelineModel setIsOpen={isCreatePipelineModelOpen} />
      </Model>
      <section className="h-[60px] flex items-center justify-between px-5 py-3 border-b">
        <h3>Edit Stages</h3>
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
      </section>
      {data.length && activePipeline && (
        <EditStages pipeline={activePipeline} setIsEditStageView={setIsOpen} />
      )}
    </>
  ) : (
    <section className="h-screen w-full flex justify-center items-center">
      <Loader />
    </section>
  );
};

export default EditKanban;
