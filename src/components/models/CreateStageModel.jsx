import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCreateStageMutation } from "../../services/stageApi";

const CreateStageModel = ({ setIsOpen, position }) => {
  const [createStage, { isLoading, isError, isSuccess }] =
    useCreateStageMutation();
  const dispatch = useDispatch();
  const [stageName, setStageName] = useState("");

  async function createStageFn() {
    await createStage({ name: stageName, position });
    discardStage();
  }
  function discardStage() {
    setIsOpen(false);
    setStageName("");
  }
  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong!");
    }
    if (isSuccess && stageName > 4) {
      toast.success(stageName + " has been created.");
    }
  }, [isSuccess, isError]);

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
            disabled={isLoading}
          >
            discard
          </button>
          <button
            className="btn-filled"
            onClick={createStageFn}
            disabled={isLoading || stageName.length < 4}
          >
            {isLoading ? "Loading..." : "create"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateStageModel;
