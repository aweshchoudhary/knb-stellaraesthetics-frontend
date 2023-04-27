import { Icon } from "@iconify/react";
import Model from "../models/Model";
import { useEffect, useState } from "react";
import CreateStageModel from "../models/CreateStageModel";
import {
  useDeleteStageMutation,
  useUpdateStageMutation,
} from "../../services/stageApi";
import { toast } from "react-toastify";

const EditColumn = ({ provided, item, pipelineId }) => {
  const [
    updateStage,
    { isLoading: isUpdateLoading, isSuccess: isUpdateSuccess },
  ] = useUpdateStageMutation();
  const [
    deleteStage,
    { isLoading: isDeleteLoading, isSuccess: isDeleteSuccess },
  ] = useDeleteStageMutation();

  const [isCreateStageModelOpen, setIsCreateStageModelOpen] = useState(false);
  const [stageName, setStageName] = useState(item.name);

  async function handleUpdateStage() {
    await updateStage({ name: stageName, stageId: item._id });
  }
  async function handleDeleteStage() {
    await deleteStage({ position: item.position, pipelineId });
  }

  useEffect(() => {
    if (isDeleteSuccess) toast.success("Stage has been deleted");
  }, [isDeleteSuccess]);

  useEffect(() => {
    if (isUpdateSuccess) toast.success("Stage has been updated");
  }, [isUpdateSuccess]);

  return (
    <>
      <Model
        title={"Create Stage"}
        isOpen={isCreateStageModelOpen}
        setIsOpen={setIsCreateStageModelOpen}
      >
        <CreateStageModel
          position={item.position + 1}
          setIsOpen={setIsCreateStageModelOpen}
          pipelineId={pipelineId}
        />
      </Model>
      <div
        className={
          "border-r shrink-0 relative bg-bg flex flex-col justify-between flex-1 h-[calc(100vh-135px)]"
        }
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <div>
          <header
            {...provided.dragHandleProps}
            className="py-2 px-5 hover:cursor-move bg-primary text-white"
          >
            <h2 className="font-medium capitalize">{item.name}</h2>
          </header>
          <div className="p-5">
            <div className="input-group">
              <label htmlFor="name" className="mb-2 block">
                Name
              </label>
              <input
                type="text"
                className="input"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder={stageName}
              />
            </div>
            <div className="flex mt-5 gap-2">
              <button
                className="btn-outlined py-1 px-3"
                disabled={
                  item.name === stageName || isDeleteLoading || isUpdateLoading
                }
              >
                cancel
              </button>
              <button
                className="btn-filled py-1 px-3"
                onClick={handleUpdateStage}
                disabled={
                  item.name === stageName || isDeleteLoading || isUpdateLoading
                }
              >
                {isDeleteLoading || isUpdateLoading ? "Loading..." : "save"}
              </button>
            </div>
          </div>
        </div>
        <footer className="p-5 bg-paper">
          <button
            onClick={handleDeleteStage}
            className="btn-filled bg-red-600 border-none py-3 w-full"
          >
            <Icon icon="uil:trash" />
            <p>delete stage</p>
          </button>
        </footer>
        <button
          onClick={() => setIsCreateStageModelOpen(true)}
          className="create-stage btn-filled bg-bg border-black w-[30px] p-0 h-[30px] rounded-full text-textColor flex items-center justify-center text-xl absolute top-0 z-10 -right-[15px]"
        >
          <Icon icon={"uil:plus"} />
        </button>
      </div>
    </>
  );
};

export default EditColumn;
