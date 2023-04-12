import { useMemo, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import {
  addTempItemToStage,
  getAllStages,
  removeTempItemFromStage,
} from "../../state/features/stageSlice";
import { Icon } from "@iconify/react";
import AddDealModel from "../deal/AddDealModel";
import Model from "../models/Model";
import Column from "./Column";
import { toast } from "react-toastify";
import CreateKanbanModel from "../models/CreateStageModel";
import { updateDealStage } from "../../state/features//dealFeatures/dealSlice";

const Kanban = ({ setIsKanBanEdit }) => {
  const dispatch = useDispatch();
  const { data, loading, error, success } = useSelector(
    (state) => state.stages
  );
  const deals = useSelector((state) => state.deals);
  const [editDealModelDisplay, setEditDealModelDisplay] = useState(false);
  const [addDealModelDisplay, setAddDealModelDisplay] = useState(false);
  const [createStageModelDisplay, setCreateStageModelDisplay] = useState(false);

  const onDragEnd = (result) => {
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
      dispatch(
        updateDealStage({
          cardId: result.draggableId,
          prevStageId: result.source.droppableId,
          newStageId: result.destination.droppableId,
        })
      );
    }
  };

  useMemo(() => {
    dispatch(getAllStages());
  }, [error, deals.error]);

  return (
    <>
      {error && toast.error("Some thing went wrong.")}
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
          <div>
            <button
              onClick={() => setAddDealModelDisplay(true)}
              className="btn-filled btn-small"
            >
              <Icon icon={"uil:plus"} className="text-xl" />
              Deal
            </button>
          </div>
          <div>
            <div></div>
            <div>
              <button
                className="btn-filled btn-small"
                onClick={() => setIsKanBanEdit(true)}
              >
                edit
              </button>
            </div>
          </div>
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
                      loading={loading}
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
