import { lazy, useEffect, useState } from "react";
import { useGetPipelinesQuery } from "../../services/pipelineApi";
import Model from "../models/Model";
import CreatePipelineModel from "../models/CreatePipelineModel";
import { Icon } from "@iconify/react";
import Loader from "../global/Loader";
import CreateDealModel from "../models/CreateDealModel";

const Stages = lazy(() => import("../stage/Stages"));
const EditStages = lazy(() => import("../stage/EditStages"));

const Kanban = ({}) => {
  const [isStageEditView, setIsEditStageView] = useState(false);
  const { data, isLoading, isFetching, isSuccess } = useGetPipelinesQuery();
  const [isCreatePipelineModelOpen, setIsCreatePipelineModelOpen] =
    useState(false);
  const [isCreateDealModelOpen, setIsCreateDealModelOpen] = useState(false);
  const [activePipeline, setActivePipeline] = useState(null);

  function handleStageEditViewClose() {
    setIsEditStageView(false);
  }

  useEffect(() => {
    if (!isFetching && data.length) {
      setActivePipeline(data[0]);
    }
  }, [data, isFetching]);

  return !isLoading && !isFetching && isSuccess ? (
    <>
      <Model
        title={"Create Pipeline"}
        isOpen={isCreatePipelineModelOpen}
        setIsOpen={setIsCreatePipelineModelOpen}
      >
        <CreatePipelineModel setIsOpen={isCreatePipelineModelOpen} />
      </Model>
      {data.length ? (
        isStageEditView ? (
          <>
            <section className="h-[60px] flex items-center justify-between px-5 py-3 border-b">
              <h3>Edit Stages</h3>
              <div className="flex items-center gap-2">
                <button
                  className="btn-filled btn-small"
                  onClick={handleStageEditViewClose}
                >
                  close
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            <Model
              title={"Add Deal"}
              isOpen={isCreateDealModelOpen}
              setIsOpen={setIsCreateDealModelOpen}
            >
              <CreateDealModel
                activePipe={activePipeline}
                pipelineId={activePipeline?._id}
                setIsOpen={setIsCreateDealModelOpen}
              />
            </Model>
            <section className="px-5 py-3 flex justify-between items-center border-b">
              <div className="flex items-stretch gap-2">
                <button
                  className="btn-filled btn-small"
                  onClick={() => setIsCreateDealModelOpen(true)}
                >
                  New Deal
                </button>
                <button
                  className="btn-filled btn-small"
                  onClick={() => setIsCreatePipelineModelOpen(true)}
                >
                  New Pipeline
                </button>
                <button className="btn-outlined btn-small">Refresh</button>
              </div>
              <div className="flex items-stretch gap-2">
                <select
                  name="pipeline-select"
                  className="input w-[200px]"
                  id="pipeline-select"
                  // onSelect={(e) =>
                  //   setActivePipeline((prev) => prev[e.target.value])
                  // }
                  onChange={(e) => setActivePipeline(data[e.target.value])}
                >
                  {data.map((pipe, index) => {
                    return pipe?._id === activePipeline?._id ? (
                      <option
                        key={index}
                        selected
                        defaultValue={pipe._id}
                        value={pipe._id}
                      >
                        {pipe.name}
                      </option>
                    ) : (
                      <option key={index} value={index}>
                        {pipe.name}
                      </option>
                    );
                  })}
                </select>
                <button
                  className="btn-outlined"
                  onClick={() => setIsEditStageView(true)}
                >
                  <Icon icon="uil:pen" />
                </button>
              </div>
            </section>
          </>
        )
      ) : null}
      {data.length && activePipeline ? (
        <>
          {isStageEditView ? (
            <EditStages
              pipeline={activePipeline}
              setIsEditStageView={setIsEditStageView}
            />
          ) : (
            <Stages
              pipeline={activePipeline}
              setIsEditStageView={setIsEditStageView}
            />
          )}
        </>
      ) : (
        <p className="p-10">
          No pipeline has been created yet.{" "}
          <button
            className="underline"
            onClick={() => setIsCreatePipelineModelOpen(true)}
          >
            Create
          </button>
        </p>
      )}
    </>
  ) : (
    <section className="h-screen w-full justify-center items-center">
      <Loader />
    </section>
  );
};

export default Kanban;
