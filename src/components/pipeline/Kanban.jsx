import React, { Suspense, lazy, useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import Loader from "../global/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addPipeline } from "../../state/features/globalSlice";
import Stages from "../stage/Stages";

import { useGetPipelinesQuery } from "../../services/pipelineApi";

const Model = lazy(() => import("../models/Model"));
const CreatePipelineModel = lazy(() => import("../models/CreatePipelineModel"));
const CreateDealModel = lazy(() =>
  import("../models/createDealModel/CreateDealModel")
);

const Kanban = ({ setIsOpen }) => {
  const savedPipelineIndex = useSelector((state) => state.global.pipelineIndex);
  const dispatch = useDispatch();
  const [isStagesLength, setIsStagesLength] = useState(false);
  const [activePipeline, setActivePipeline] = useState(null);

  const {
    data = [],
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useGetPipelinesQuery();

  const [isCreatePipelineModelOpen, setIsCreatePipelineModelOpen] =
    useState(false);
  const [isCreateDealModelOpen, setIsCreateDealModelOpen] = useState(false);

  useEffect(() => {
    if (!data.length) return;
    if (!savedPipelineIndex) {
      dispatch(addPipeline(0));
      setActivePipeline(data[0]);
      return;
    }
    if (!data[savedPipelineIndex]) dispatch(addPipeline(0));
    setActivePipeline(data[savedPipelineIndex]);
  }, [data, isSuccess]);

  return !isLoading && !isFetching && isSuccess ? (
    <>
      <Suspense>
        {isCreatePipelineModelOpen && (
          <Model
            title={"Create Pipeline"}
            isOpen={isCreatePipelineModelOpen}
            setIsOpen={setIsCreatePipelineModelOpen}
          >
            <CreatePipelineModel setIsOpen={setIsCreatePipelineModelOpen} />
          </Model>
        )}
      </Suspense>
      <Suspense>
        {activePipeline && isCreateDealModelOpen && (
          <Model
            title={"Create New Deal"}
            isOpen={isCreateDealModelOpen}
            setIsOpen={setIsCreateDealModelOpen}
          >
            <CreateDealModel
              activePipe={activePipeline}
              pipelineId={activePipeline?._id}
              setIsOpen={setIsCreateDealModelOpen}
            />
          </Model>
        )}
      </Suspense>
      {data.length !== 0 && (
        <header className="px-5 py-2 flex justify-between items-center border-b">
          <div className="flex items-stretch gap-2">
            <button
              className="btn-filled btn-small"
              onClick={() => setIsCreateDealModelOpen(true)}
              disabled={!isStagesLength}
            >
              <Icon icon="uil:plus" className="text-lg" /> <span>Deal</span>
            </button>
            <button
              className="btn-outlined btn-small"
              onClick={() => refetch()}
            >
              <Icon icon="tabler:reload" className="text-lg" />
              <span>Refresh</span>
            </button>
          </div>
          <div>
            <h2 className="text-xl capitalize font-semibold">
              {activePipeline?.name}
            </h2>
          </div>
          <div className="flex items-stretch gap-2">
            <select
              name="pipeline-select"
              className="input w-[200px]"
              id="pipeline-select"
              onChange={(e) => {
                setActivePipeline(data[e.target.value]);
                dispatch(addPipeline(e.target.value));
              }}
            >
              {data?.map((pipe, index) => {
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
            <Tooltip title="Edit Pipeline" arrow>
              <button
                className="btn-outlined btn-small"
                onClick={() => setIsOpen(true)}
              >
                <Icon icon="uil:pen" />
              </button>
            </Tooltip>
            <Tooltip title="Create Pipeline" arrow>
              <button
                className="btn-outlined btn-small"
                onClick={() => setIsCreatePipelineModelOpen(true)}
              >
                <Icon icon="uil:plus" className="text-lg" />
              </button>
            </Tooltip>
          </div>
        </header>
      )}
      <section>
        {data.length && activePipeline ? (
          <Stages
            setIsStagesLength={setIsStagesLength}
            pipeline={activePipeline}
            setIsEditStageView={setIsOpen}
          />
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
      </section>
    </>
  ) : (
    <section className="h-screen w-full flex justify-center items-center">
      <Loader />
    </section>
  );
};

export default Kanban;
