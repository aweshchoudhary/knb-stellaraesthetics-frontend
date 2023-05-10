import React, { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCreateStageMutation } from "@/redux/services/stageApi";

const CreateStageModel = ({ setIsOpen, position, pipelineId }) => {
  const [createStage, { isLoading, isError, isSuccess }] =
    useCreateStageMutation();
  const [stageName, setStageName] = useState("");

  async function createStageFn() {
    if (!pipelineId) return toast.error("Pipeline ID is required");
    await createStage({ name: stageName, position, pipelineId });
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
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(stageName + " Stage has been created.");
    }
  }, [isSuccess]);

  return (
    <Suspense>
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
    </Suspense>
  );
};

export default CreateStageModel;
