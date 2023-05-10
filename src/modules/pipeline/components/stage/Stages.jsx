import React, { Suspense, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { toast } from "react-toastify";

import { useLazyGetStagesQuery } from "@/redux/services/stageApi";
import { useUpdateDealStageMutation } from "@/redux/services/dealApi";
import Column from "./Column";

import { Model } from "@/modules/common";
import { CreateStageModel } from "@/modules/pipeline";

const Stages = ({ pipeline, setIsStagesLength }) => {
  const [columns, setColumns] = useState({});
  const [isCreateStageModelOpen, setIsCreateStageModelOpen] = useState(false);
  const [
    getStages,
    { data, isLoading, isFetching, isSuccess, isError, error },
  ] = useLazyGetStagesQuery();
  const [updateDealStage] = useUpdateDealStageMutation();

  const onDragEnd = async (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.deals];
      const destItems = [...destColumn.deals];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          deals: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          deals: destItems,
        },
      });
      await updateDealStage({
        dealId: draggableId,
        prevStageId: source.droppableId,
        newStageId: destination.droppableId,
      });
    }
  };

  useEffect(() => {
    const fetchStages = async (pipelineId) =>
      await getStages({
        filters: JSON.stringify([{ id: "pipelineId", value: pipelineId }]),
        data: true,
      });
    if (pipeline?._id) fetchStages(pipeline._id);
  }, [pipeline]);

  useEffect(() => {
    if (data?.data?.length) {
      setIsStagesLength(true);
      data?.data?.forEach((stage) => {
        setColumns((prev) => ({
          ...prev,
          [stage._id]: {
            ...stage,
          },
        }));
      });
    }
  }, [data]);

  useEffect(() => {
    if (isError) toast.error(error.data?.message);
  }, [isError]);

  return (
    <Suspense>
      <section
        className={`w-full  ${
          !isLoading && !isFetching && isSuccess ? "opacity-100" : "opacity-50"
        }`}
      >
        <div className="flex justify-center h-full">
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).length ? (
              Object.entries(columns).map(([columnId, column], index) => {
                return (
                  <Column columnId={columnId} column={column} key={index} />
                );
              })
            ) : (
              <div className="p-5">
                No stages has been created yet.{" "}
                <button
                  className="underline"
                  onClick={() => setIsCreateStageModelOpen(true)}
                >
                  Create One
                </button>
              </div>
            )}
          </DragDropContext>
        </div>
      </section>
      <Models
        pipeline={pipeline}
        isCreateStageModelOpen={isCreateStageModelOpen}
        setIsCreateStageModelOpen={setIsCreateStageModelOpen}
      />
    </Suspense>
  );
};

const Models = ({
  setIsCreateStageModelOpen,
  isCreateStageModelOpen,
  pipeline,
}) => {
  return (
    <Suspense>
      {
        <Model
          title="Create Stage"
          isOpen={isCreateStageModelOpen}
          setIsOpen={setIsCreateStageModelOpen}
        >
          <CreateStageModel
            pipelineId={pipeline._id}
            setIsOpen={setIsCreateStageModelOpen}
          />
        </Model>
      }
    </Suspense>
  );
};

export default Stages;
