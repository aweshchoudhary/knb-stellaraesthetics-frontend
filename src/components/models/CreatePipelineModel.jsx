import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCreatePipelineMutation } from "../../redux/services/pipelineApi";
import { useGetMeQuery } from "../../redux/services/userApi";

const CreatePipelineModel = ({ setIsOpen }) => {
  const { data } = useGetMeQuery();
  const [name, setName] = useState("");
  const [createPipeline, { isLoading, isError, isSuccess, error }] =
    useCreatePipelineMutation();

  async function handleCreatePipeline() {
    if (!data._id) toast.error("Owner is required");
    await createPipeline({ name, owner: data._id });
    clear();
  }

  function clear() {
    setName("");
    setIsOpen(false);
  }

  useEffect(() => {
    if (isSuccess) toast.success("Pipeline created successfully");
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.success(error.data.message);
  }, [isError]);
  return (
    <section>
      <div className="p-10">
        {" "}
        <div className="mb-3">
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
        </div>
        <label htmlFor="pipeline-name" className="block mb-2">
          Pipeline Owner
        </label>
        <div className="input capitalize">{data.fullname} (You)</div>
      </div>
      <footer className="modal-footer">
        <button className="btn-outlined" onClick={clear} disabled={isLoading}>
          cancel
        </button>
        <button
          className="btn-filled"
          onClick={handleCreatePipeline}
          disabled={isLoading || !name}
        >
          {isLoading ? "Loading..." : "Create Pipeline"}
        </button>
      </footer>
    </section>
  );
};

export default CreatePipelineModel;
