import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import {
  addTempItemToStage,
  removeTempItemFromStage,
} from "../../state/features/stageSlice";
import { Icon } from "@iconify/react";
import AddDealModel from "../models/AddDealModel";
import Model from "../models/Model";
import Column from "./Column";
import { toast } from "react-toastify";
import CreateKanbanModel from "../models/CreateStageModel";
import Loader from "../global/Loader";
import { useGetStagesQuery } from "../../services/stageApi";
import { useUpdateCardStageMutation } from "../../services/dealApi";

const Kanban = ({ setIsKanBanEdit }) => {
  const dispatch = useDispatch();
  const { data, isLoading, isError, isFetching, isSuccess, error, refetch } =
    useGetStagesQuery();
  const [updateCardStage] = useUpdateCardStageMutation();

  const [editDealModelDisplay, setEditDealModelDisplay] = useState(false);
  const [addDealModelDisplay, setAddDealModelDisplay] = useState(false);
  const [createStageModelDisplay, setCreateStageModelDisplay] = useState(false);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      dispatch(
        removeTempItemFromStage({
          stageId: source.droppableId,
          itemPosition: source.index,
        })
      );
      dispatch(
        addTempItemToStage({
          stageId: destination.droppableId,
          item: draggableId,
        })
      );
      await updateCardStage({
        cardId: result.draggableId,
        prevStageId: result.source.droppableId,
        newStageId: result.destination.droppableId,
      });
    }
  };

  return !isLoading && !isFetching && isSuccess ? (
    <>
      {isError && toast.error(error)}
      <Models
        editDealModelDisplay={editDealModelDisplay}
        setEditDealModelDisplay={setEditDealModelDisplay}
        addDealModelDisplay={addDealModelDisplay}
        setAddDealModelDisplay={setAddDealModelDisplay}
        createStageModelDisplay={createStageModelDisplay}
        setCreateStageModelDisplay={setCreateStageModelDisplay}
      />
      {data.length ? (
        <section className="flex items-center justify-between px-5 py-2 border-b">
          <button
            onClick={() => setAddDealModelDisplay(true)}
            className="btn-filled btn-small"
          >
            <Icon icon={"uil:plus"} className="text-xl" />
            Deal
          </button>
          <button
            className="btn-filled btn-small"
            onClick={() => setIsKanBanEdit(true)}
          >
            edit view
          </button>
        </section>
      ) : null}
      {data.length ? (
        <section className="h-[calc(100vh-120px)]">
          <div className="flex overflow-x-auto w-full h-full">
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
              {data &&
                data.map((stage) => {
                  return (
                    <Column
                      stage={stage}
                      key={stage._id}
                      loading={isLoading}
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
  ) : (
    <section className="h-screen w-full flex items-center justify-center">
      <Loader />
    </section>
  );
};

const Models = ({
  editDealModelDisplay,
  setEditDealModelDisplay,
  addDealModelDisplay,
  setAddDealModelDisplay,
  setCreateStageModelDisplay,
  createStageModelDisplay,
}) => {
  return (
    <>
      <Model
        title={"Add Deal"}
        isOpen={addDealModelDisplay}
        setIsOpen={setAddDealModelDisplay}
      >
        <AddDealModel setIsOpen={setAddDealModelDisplay} />
      </Model>
      <Model
        title={"Edit Deal"}
        isOpen={editDealModelDisplay}
        setIsOpen={setEditDealModelDisplay}
      ></Model>
      <Model
        title="Create Stage"
        isOpen={createStageModelDisplay}
        setIsOpen={setCreateStageModelDisplay}
      >
        <CreateKanbanModel setIsOpen={setCreateStageModelDisplay} />
      </Model>
    </>
  );
};

export default Kanban;
