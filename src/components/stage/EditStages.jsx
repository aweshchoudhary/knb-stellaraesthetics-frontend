import { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import EditColumn from "./EditColumn";
import Loader from "../global/Loader";
import {
  useGetStagesQuery,
  useReorderStageMutation,
} from "../../services/stageApi";

const EditStage = ({ setIsEditStageView, pipeline }) => {
  const { data, isLoading, isSuccess, isFetching, isError } = useGetStagesQuery(
    pipeline._id
  );
  const [reorderStages, { isLoading: isStagesReorderLoading }] =
    useReorderStageMutation();
  const onDragComplete = async (result) => {
    if (!result.destination) return;
    const { destination, draggableId } = result;
    await reorderStages({
      stageId: draggableId,
      newPosition: destination.index,
    });
  };

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong");
    }
  }, [isError]);

  return !isLoading && !isFetching && isSuccess ? (
    <>
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
                              pipelineId={pipeline._id}
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

export default EditStage;
