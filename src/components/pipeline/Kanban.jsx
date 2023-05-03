import React, { Suspense, lazy, useState } from "react";
import { Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import Stages from "../stage/Stages";

import { useGetPipelinesQuery } from "../../redux/services/pipelineApi";
import { useNavigate } from "react-router-dom";
import Loader from "../global/Loader";

const Model = lazy(() => import("../models/Model"));
const CreatePipelineModel = lazy(() => import("../models/CreatePipelineModel"));
const CreateDealModel = lazy(() =>
  import("../models/createDealModel/CreateDealModel")
);

const Kanban = ({ setIsOpen, pipeline, isFetching, isLoading }) => {
  const [isStagesLength, setIsStagesLength] = useState(false);
  const navigate = useNavigate();

  const {
    data,
    isLoading: isPipelinesLoading,
    isFetching: isPipeinesFetching,
    isSuccess: isPipelinesSuccess,
    refetch: refetchPipelines,
  } = useGetPipelinesQuery({ data: true });

  const [isCreatePipelineModelOpen, setIsCreatePipelineModelOpen] =
    useState(false);
  const [isCreateDealModelOpen, setIsCreateDealModelOpen] = useState(false);

  return (
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
        {pipeline && isCreateDealModelOpen && (
          <Model
            title={"Create New Deal"}
            isOpen={isCreateDealModelOpen}
            setIsOpen={setIsCreateDealModelOpen}
          >
            <CreateDealModel
              activePipe={pipeline}
              pipelineId={pipeline?._id}
              setIsOpen={setIsCreateDealModelOpen}
            />
          </Model>
        )}
      </Suspense>
      {isPipelinesSuccess && data.data.length !== 0 && (
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
              onClick={() => {
                refetchPipelines();
              }}
            >
              <Icon icon="tabler:reload" className="text-lg" />
              <span>Refresh</span>
            </button>
          </div>
          <div>
            <h2 className="text-xl capitalize font-semibold">
              {pipeline?.name}
            </h2>
          </div>
          <div className="flex items-stretch gap-2">
            {!isPipeinesFetching && !isPipelinesLoading && (
              <select
                name="pipeline-select"
                className="input w-[200px]"
                id="pipeline-select"
                onChange={(e) => {
                  navigate("/pipeline/" + e.target.value);
                }}
              >
                {data?.data?.map((pipe, index) => {
                  return pipe?._id === pipeline?._id ? (
                    <option
                      key={index}
                      selected
                      defaultValue={pipe._id}
                      value={pipe._id}
                    >
                      {pipe.name}
                    </option>
                  ) : (
                    <option key={index} value={pipe._id}>
                      {pipe.name}
                    </option>
                  );
                })}
              </select>
            )}
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
        {!isLoading && !isFetching ? (
          <Stages
            setIsStagesLength={setIsStagesLength}
            pipeline={pipeline}
            setIsEditStageView={setIsOpen}
          />
        ) : (
          <section className="flex h-[calc(100vh-108px)] w-full items-center justify-center">
            <Loader />
          </section>
        )}
      </section>
    </>
  );
};

export default Kanban;
