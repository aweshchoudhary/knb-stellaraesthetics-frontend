import { useEffect, useState } from "react";
import { useGetPipelinesQuery } from "../../services/pipelineApi";
import Model from "../models/Model";
import CreatePipelineModel from "../models/CreatePipelineModel";
import { Icon } from "@iconify/react";
import Loader from "../global/Loader";
import CreateDealModel from "../models/CreateDealModel";
import { useDispatch, useSelector } from "react-redux";
import { changePipeline } from "../../state/features/globalSlice";
import Stages from "../stage/Stages";
import { Tooltip } from "@mui/material";

const Kanban = ({ setIsOpen }) => {
  const savedPipelineIndex = useSelector((state) => state.global.pipelineIndex);
  const dispatch = useDispatch();
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
    if (data.length && isSuccess) {
      setActivePipeline(data[savedPipelineIndex]);
    }
  }, [data, isSuccess]);

  return !isLoading && !isFetching && isSuccess ? (
    <>
      <Model
        title={"Create Pipeline"}
        isOpen={isCreatePipelineModelOpen}
        setIsOpen={setIsCreatePipelineModelOpen}
      >
        <CreatePipelineModel setIsOpen={setIsCreatePipelineModelOpen} />
      </Model>
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
            <Icon icon="uil:plus" className="text-lg" /> <span>Deal</span>
          </button>
          <button className="btn-outlined btn-small" onClick={() => refetch()}>
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
              dispatch(changePipeline(e.target.value));
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
      </section>
      {data.length && activePipeline ? (
        <Stages pipeline={activePipeline} setIsEditStageView={setIsOpen} />
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
    <section className="h-screen w-full flex justify-center items-center">
      <Loader />
    </section>
  );
};

export default Kanban;
