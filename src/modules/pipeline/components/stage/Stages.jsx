import React, { Suspense, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { toast } from "react-toastify";

import {
  useLazyGetStagesQuery,
  useUpdateStageMutation,
} from "@/redux/services/stageApi";
import { useUpdateDealStageMutation } from "@/redux/services/dealApi";
import Column from "./Column";

import { Model } from "@/modules/common";
import { CreateStageModel } from "@/modules/pipeline";

const Stages = ({ pipeline, setIsStagesLength }) => {
  const [isCreateStageModelOpen, setIsCreateStageModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [
    getStages,
    { data: stages, isLoading, isFetching, isSuccess, isError, error },
  ] = useLazyGetStagesQuery();

  const [updateDealStage] = useUpdateDealStageMutation();
  const [updateStage] = useUpdateStageMutation();

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    setLoading(true);
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      await updateDealStage({
        dealId: draggableId,
        prevStageId: source.droppableId,
        newStageId: destination.droppableId,
      });
      await updateStage({
        stageId: source.droppableId,
        update: {
          $pull: { deals: draggableId },
        },
      });
      await updateStage({
        stageId: destination.droppableId,
        update: {
          $push: { deals: draggableId },
        },
      });
      setLoading(false);
    }
  };

  const fetchStages = async (pipelineId) => {
    const { data } = await getStages({
      filters: JSON.stringify([{ id: "pipelineId", value: pipelineId }]),
      data: true,
    });
    if (data?.data?.length) setIsStagesLength(true);
  };

  useEffect(() => {
    if (pipeline?._id) fetchStages(pipeline._id);
  }, [pipeline]);

  useEffect(() => {
    if (isError) toast.error(error.data?.message);
  }, [isError]);

  return (
    <Suspense>
      <section
        className={`w-full  ${
          !isLoading && !isFetching && !loading && isSuccess
            ? "opacity-100"
            : "opacity-50"
        }`}
      >
        <div className="flex justify-center h-full">
          <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            {stages?.data?.length ? (
              stages.data.map((stage, index) => {
                return (
                  <Column columnId={stage._id} column={stage} key={index} />
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
