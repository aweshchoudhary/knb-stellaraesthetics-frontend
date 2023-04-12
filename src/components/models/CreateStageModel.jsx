import { useDispatch, useSelector } from "react-redux";
import { createStage } from "../../state/features/stageSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CreateStageModel = ({ setIsOpen, position }) => {
  const { loading, error, success } = useSelector((state) => state.stages);
  const dispatch = useDispatch();
  const [stageName, setStageName] = useState("");

  function createStageFn() {
    dispatch(createStage({ name: stageName, position }));
    setIsOpen(false);
  }
  function discardStage() {
    setIsOpen(false);
  }
  useEffect(() => {
    if (error) {
      toast.error("Something went wrong!");
    }
    if (success && stageName > 4) {
      toast.success(stageName + " has been created.");
    }
  }, [success, error]);

  return (
    <section className="p-5">
      <div>
        <h2 className="mb-2 text-xl font-medium">Create Stage</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Stage Name"
            id="stage-name"
            name="stage-name"
            className="input"
            value={stageName}
            onChange={(e) => setStageName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-outlined"
            onClick={discardStage}
            disabled={loading}
          >
            discard
          </button>
          <button
            className="btn-filled"
            onClick={createStageFn}
            disabled={loading || stageName.length < 4}
          >
            {loading ? "Loading..." : "create"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateStageModel;
