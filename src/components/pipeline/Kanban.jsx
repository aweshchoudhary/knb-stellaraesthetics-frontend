import React, { Suspense, lazy, useState } from "react";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import Stages from "../stage/Stages";

import Loader from "../global/Loader";

const Model = lazy(() => import("../models/Model"));
const CreatePipelineModel = lazy(() => import("../models/CreatePipelineModel"));
const CreateDealModel = lazy(() =>
  import("../models/createDealModel/CreateDealModel")
);

const PipelineView = ({
  setIsOpen,
  pipeline,
  isFetching,
  isLoading,
  viewOnly,
  refetchPipeline,
}) => {
  const [isStagesLength, setIsStagesLength] = useState(false);

  const [isCreatePipelineModelOpen, setIsCreatePipelineModelOpen] =
    useState(false);
  const [isCreateDealModelOpen, setIsCreateDealModelOpen] = useState(false);

  return (
    <>
      <Suspense>
        {isCreatePipelineModelOpen && !viewOnly && (
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
        {pipeline && !viewOnly && isCreateDealModelOpen && (
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
      <header className="px-5 py-2 flex justify-between items-center border-b">
        <div className="flex items-stretch gap-2">
          <Tooltip title={viewOnly ? "View Only" : "Create Deal"}>
            <button
              className="btn-filled btn-small"
              onClick={() => setIsCreateDealModelOpen(true)}
              disabled={!isStagesLength || viewOnly}
            >
              <Icon icon="uil:plus" className="text-lg" /> <span>Deal</span>
            </button>
          </Tooltip>
          <button
            className="btn-outlined btn-small"
            onClick={() => {
              refetchPipeline();
            }}
          >
            <Icon icon="tabler:reload" className="text-lg" />
            <span>Refresh</span>
          </button>
        </div>
        <div>
          <h2 className="text-xl capitalize font-semibold">{pipeline?.name}</h2>
        </div>
        <div className="flex items-stretch gap-2">
          <PipelineMenuDropDown
            setIsOpen={setIsOpen}
            setIsCreatePipelineModelOpen={setIsCreatePipelineModelOpen}
            viewOnly={viewOnly}
          />
        </div>
      </header>
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

const PipelineMenuDropDown = ({
  setIsOpen,
  setIsCreatePipelineModelOpen,
  viewOnly,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <button
        className="btn-filled h-full btn-small"
        disabled={viewOnly}
        onClick={handleClick}
      >
        <Icon icon="ic:baseline-arrow-drop-down" className="text-2xl" />
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            setIsOpen(true);
            handleClose();
          }}
        >
          <Tooltip title="Edit Pipeline" arrow>
            <button className="flex gap-2 items-center">
              <Icon icon="uil:pen" />
              Edit Pipeline
            </button>
          </Tooltip>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsCreatePipelineModelOpen(true);
            handleClose();
          }}
        >
          <Tooltip title="Create Pipeline" arrow>
            <button className="flex gap-2 items-center">
              <Icon icon="uil:plus" className="text-lg" />
              Create Pipeline
            </button>
          </Tooltip>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default PipelineView;
