import { useEffect, useState } from "react";
import { useUpdatePipelineMutation } from "../../services/pipelineApi";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

const EditPipelineName = ({ name, id }) => {
  const [pipelineName, setPipelineName] = useState(name || "");

  const [updatePipeline, { isLoading, isSuccess }] =
    useUpdatePipelineMutation();

  async function handleUpdatePipelineName() {
    await updatePipeline({ id, update: { name: pipelineName } });
  }
  function handleReset() {
    setPipelineName(name);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Name updated successfully");
    }
  }, [isSuccess]);

  return (
    <div className="flex-1 flex gap-1">
      <input
        type="text"
        value={pipelineName}
        className="input w-1/4"
        onChange={(e) => setPipelineName(e.target.value)}
      />
      {pipelineName !== name ? (
        <div className="btns flex items-stretch gap-1">
          <button
            onClick={handleUpdatePipelineName}
            className="btn-filled btn-small"
            disabled={isLoading}
          >
            <Icon icon="uil:check" className="text-xl" />
          </button>
          <button
            disabled={isLoading}
            onClick={handleReset}
            className="btn-outlined btn-small"
          >
            <Icon icon="uil:times" className="text-xl" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default EditPipelineName;
