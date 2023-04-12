import { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import EditColumn from "./EditColumn";
import { getAllStages, reorderStages } from "../../state/features/stageSlice";
import Loader from "../global/Loader";

const EditKanban = ({ setIsKanBanEdit }) => {
  const { data, loading, error, success } = useSelector(
    (state) => state.stages
  );
  const dispatch = useDispatch();

  const onDragComplete = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    dispatch(
      reorderStages({ stageId: draggableId, newPosition: destination.index })
    );
  };

  function handleKanBanSave() {
    setIsKanBanEdit(false);
  }

  useEffect(() => {
    dispatch(getAllStages());
  }, [success]);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong");
    }
  }, [error]);

  return !loading && data ? (
    <>
      <section className="h-[60px] flex items-center justify-between px-5 py-3 border-b">
        <h3>Edit Stages</h3>
        <div className="flex items-center gap-2">
          <button className="btn-filled" onClick={handleKanBanSave}>
            close
          </button>
        </div>
      </section>
      <section className="h-[calc(100%-120px)] bg-paper">
        <DragDropContext onDragEnd={onDragComplete}>
          <div className="overflow-x-auto h-full w-full">
            <Droppable droppableId="drag-drop-list" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  className="flex overflow-x-auto h-full"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {data.length
                    ? data.map((item) => (
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
                            />
                          )}
                        </Draggable>
                      ))
                    : null}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </section>
    </>
  ) : (
    <section className="w-full h-screen flex items-center justify-center">
      <Loader />
    </section>
  );
};

export default EditKanban;
