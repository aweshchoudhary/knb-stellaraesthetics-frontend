import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Model from "../models/Model";
import Column from "./Column";
import { toast } from "react-toastify";
import CreateStageModel from "../models/CreateStageModel";
import { useGetStagesQuery } from "../../services/stageApi";
import { useUpdateCardStageMutation } from "../../services/dealApi";

const Stages = ({ pipeline, setIsStagesLength }) => {
  const {
    data = [],
    isLoading,
    isError,
    isFetching,
    isSuccess,
    error,
  } = useGetStagesQuery(pipeline._id);
  const [
    updateCardStage,
    { isLoading: isUpdatingStage, isSuccess: isUpdateSuccess },
  ] = useUpdateCardStageMutation();

  const [editDealModelDisplay, setEditDealModelDisplay] = useState(false);
  const [createStageModelDisplay, setCreateStageModelDisplay] = useState(false);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      await updateCardStage({
        cardId: draggableId,
        prevStageId: source.droppableId,
        newStageId: destination.droppableId,
      });
    }
  };

  useEffect(() => {
    if (data.length) {
      setIsStagesLength(true);
    } else {
      setIsStagesLength(false);
    }
  }, [data]);
  return (
    isSuccess && (
      <>
        {isError && toast.error(error)}
        <Models
          editDealModelDisplay={editDealModelDisplay}
          setEditDealModelDisplay={setEditDealModelDisplay}
          createStageModelDisplay={createStageModelDisplay}
          setCreateStageModelDisplay={setCreateStageModelDisplay}
          pipeline={pipeline}
        />
        {data.length ? (
          <section
            className={`h-[calc(100vh-120px)] ${
              isUpdatingStage && !isUpdateSuccess ? "opacity-50" : null
            }`}
          >
            <div className="flex overflow-x-auto w-full h-full">
              <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                {data &&
                  data.map((stage) => {
                    return (
                      <Column
                        stage={stage}
                        key={stage._id}
                        loading={isLoading || isFetching}
                        length={data.length}
                      />
                    );
                  })}
              </DragDropContext>
            </div>
          </section>
        ) : (
          <section className="md:p-10 p-5">
            <p>
              No stages has been created yet.{" "}
              <button
                onClick={() => setCreateStageModelDisplay(true)}
                className="underline"
              >
                Create One
              </button>
            </p>
          </section>
        )}
      </>
    )
  );
};

const Models = ({
  setCreateStageModelDisplay,
  createStageModelDisplay,
  pipeline,
}) => {
  return (
    <>
      <Model
        title="Create Stage"
        isOpen={createStageModelDisplay}
        setIsOpen={setCreateStageModelDisplay}
      >
        <CreateStageModel
          pipelineId={pipeline._id}
          setIsOpen={setCreateStageModelDisplay}
        />
      </Model>
    </>
  );
};

export default Stages;
