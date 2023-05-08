import React, { Suspense, lazy, useState } from "react";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import Stages from "../stage/Stages";

import Loader from "../global/Loader";
import PipelineUsersModel from "../models/PipelineUsersModel";

const Model = lazy(() => import("../models/Model"));
const CreateDealModel = lazy(() =>
  import("../models/createDealModel/CreateDealModel")
);

const PipelineView = ({
  setIsOpen,
  pipeline,
  isFetching,
  isLoading,
  viewOnly,
  viewUserRole,
  refetchPipeline,
}) => {
  const [isStagesLength, setIsStagesLength] = useState(false);

  useState(false);
  const [isCreateDealModelOpen, setIsCreateDealModelOpen] = useState(false);
  const [isPipelineUsersModelOpen, setIsPipelineUsersModelOpen] =
    useState(false);
  return (
    <>
      <Suspense>
        {pipeline && !viewOnly && isCreateDealModelOpen && (
          <Model
            title={"Create New Deal"}
            isOpen={isCreateDealModelOpen}
            setIsOpen={setIsCreateDealModelOpen}
          >
            <CreateDealModel
              pipelineId={pipeline?._id}
              setIsOpen={setIsCreateDealModelOpen}
            />
          </Model>
        )}
      </Suspense>
      <Suspense>
        {pipeline && !viewOnly && isPipelineUsersModelOpen && (
          <Model
            title={"Authorized Users"}
            isOpen={isPipelineUsersModelOpen}
            setIsOpen={setIsPipelineUsersModelOpen}
          >
            <PipelineUsersModel
              pipeline={pipeline}
              setIsOpen={setIsPipelineUsersModelOpen}
            />
          </Model>
        )}
      </Suspense>
      <header className="px-5 py-2 flex justify-between items-center border-b">
        <div>
          <h2 className="text-xl capitalize font-semibold">{pipeline?.name}</h2>
        </div>
        <div className="flex items-stretch gap-2">
          <button
            className="btn-filled btn-small h-full"
            onClick={() => setIsCreateDealModelOpen(true)}
            disabled={!isStagesLength || viewOnly}
          >
            <Icon icon="uil:plus" className="text-lg" /> <span>Deal</span>
          </button>
          <button
            className="btn-outlined btn-small"
            onClick={() => {
              refetchPipeline();
            }}
          >
            <Icon icon="tabler:reload" className="text-lg" />
            <span>Refresh</span>
          </button>
          <PipelineMenuDropDown
            setIsOpen={setIsOpen}
            setIsPipelineUsersModelOpen={setIsPipelineUsersModelOpen}
            viewOnly={viewOnly}
            viewUserRole={viewUserRole}
          />
        </div>
      </header>
      <section>
        {!isLoading && !isFetching ? (
          <Stages
            setIsStagesLength={setIsStagesLength}
            pipeline={pipeline}
            setIsEditStageView={setIsOpen}
            viewOnly={viewOnly}
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
  viewOnly,
  setIsPipelineUsersModelOpen,
  viewUserRole,
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
        className="btn-outlined h-full btn-small"
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
        {viewUserRole === "owner" && (
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
        )}
        <MenuItem
          onClick={() => {
            setIsPipelineUsersModelOpen(true);
            handleClose();
          }}
        >
          <Tooltip title="Create Pipeline" arrow>
            <button className="flex gap-2 items-center">
              <Icon icon="mdi:eye" className="text-lg" />
              Pipeline Users
            </button>
          </Tooltip>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default PipelineView;
