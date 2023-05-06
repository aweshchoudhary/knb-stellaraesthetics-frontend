import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import EditColumn from "./EditColumn";
import {
  useGetStagesQuery,
  useReorderStageMutation,
} from "../../redux/services/stageApi";
import Model from "../models/Model";
import CreateStageModel from "../models/CreateStageModel";

const EditStage = ({ pipeline }) => {
  const {
    data = [],
    isLoading,
    isSuccess,
    isFetching,
    isError,
  } = useGetStagesQuery({
    filters: JSON.stringify([{ id: "pipelineId", value: pipeline._id }]),
    data: true,
  });

  console.log(data);

  const [reorderStages, { isLoading: isStagesReorderLoading }] =
    useReorderStageMutation();

  const onDragComplete = async (result) => {
    if (!result.destination) return;
    const { destination, draggableId } = result;
    await reorderStages({
      pipelineId: pipeline._id,
      data: {
        stageId: draggableId,
        newPosition: destination.index,
      },
    });
  };

  const [createStageModelDisplay, setCreateStageModelDisplay] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong");
    }
  }, [isError]);

  return (
    <>
      <Model
        title={"Create Stage"}
        isOpen={createStageModelDisplay}
        setIsOpen={setCreateStageModelDisplay}
      >
        <CreateStageModel
          pipelineId={pipeline._id}
          setIsOpen={setCreateStageModelDisplay}
        />
      </Model>
      <section
        className={`h-[calc(100%-120px)] bg-paper ${
          !isLoading && !isFetching && isSuccess && !isStagesReorderLoading
            ? "opacity-100"
            : "opacity-50"
        }`}
      >
        <DragDropContext onDragEnd={onDragComplete}>
          <div className="overflow-x-auto h-full w-full">
            <Droppable droppableId="drag-drop-list" direction="horizontal">
              {(provided) => (
                <div
                  className="flex overflow-x-auto h-full"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {data?.data?.length ? (
                    data?.data?.map((item) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={item.position}
                      >
                        {(provided) => (
                          <EditColumn
                            provided={provided}
                            length={data.length}
                            item={item}
                            pipelineId={pipeline._id}
                          />
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <section className="md:p-10 bg-bg w-full p-5">
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
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </section>
    </>
  );
};

export default EditStage;
