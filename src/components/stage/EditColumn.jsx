import { Icon } from "@iconify/react";
import Model from "../models/Model";
import { useState } from "react";
import { deleteStage, updateStage } from "../../state/features/stageSlice";
import CreateStageModel from "../models/CreateStageModel";
import { useDispatch } from "react-redux";

const EditColumn = ({ provided, item, pipelineId }) => {
  const [isCreateStageModelOpen, setIsCreateStageModelOpen] = useState(false);
  const [stageName, setStageName] = useState(item.name);
  const dispatch = useDispatch();

  function handleUpdateStage() {
    dispatch(updateStage({ name: stageName, stageId: item._id }));
  }
  function handleDeleteStage() {
    dispatch(deleteStage(item.position));
  }
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
                disabled={item.name === stageName}
              >
                cancel
              </button>
              <button
                className="btn-filled py-1 px-3"
                onClick={handleUpdateStage}
                disabled={item.name === stageName}
              >
                save
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

// function AddStageModel({ setIsOpen, postin }) {
//   const [name, setName] = useState("");
//   const [position, setPosition] = useState(postin || 0);

//   const dispatch = useDispatch();

//   function addStage(position) {
//     dispatch(createStage({ name: "New Stage", position: position + 1 }));
//   }

//   function closeModel() {
//     setName("");
//     setIsOpen(false);
//   }
//   return (
//     <div className="p-5">
//       <h2 className="text-lg font-medium mb-3">Create Stage</h2>
//       <div>
//         <input
//           type="text"
//           placeholder="Stage name"
//           id="stage-name"
//           name="stage-name"
//           className="input"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//       </div>
//       <div className="flex items-center mt-3 gap-2">
//         <button className="btn-outlined" onClick={closeModel}>
//           cancel
//         </button>
//         <button className="btn-filled" onClick={addStage}>
//           save
//         </button>
//       </div>
//     </div>
//   );
// }

export default EditColumn;
