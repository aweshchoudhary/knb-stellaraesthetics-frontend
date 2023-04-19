import React, { useState } from "react";
import { useCreatePipelineMutation } from "../../services/pipelineApi";

const CreatePipelineModel = ({ setIsOpen }) => {
  const [name, setName] = useState("");
  const [createPipeline, { isLoading, isError, isSuccess, error }] =
    useCreatePipelineMutation();

  async function handleCreatePipeline() {
    await createPipeline({ name });
    clear();
  }

  function clear() {
    setName("");
    setIsOpen(false);
  }
  return (
    <div className="p-5">
      <label htmlFor="pipeline-name" className="block mb-2">
        Pipeline Name
      </label>
      <input
        type="text"
        placeholder="Pipeline name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        name="pipeline-name"
        id="pipeline-name"
        className="input"
      />
      <footer className="flex justify-end gap-2 mt-4">
        <button className="btn-outlined" disabled={isLoading}>
          cancel
        </button>
        <button
          className="btn-filled"
          onClick={handleCreatePipeline}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Create Pipeline"}
        </button>
      </footer>
    </div>
  );
};

export default CreatePipelineModel;
