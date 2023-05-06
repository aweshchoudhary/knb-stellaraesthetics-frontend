import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import UserSelect from "../users/UserSelect";
import {
  useAssignPipelineUserMutation,
  useRemovePipelineUserMutation,
  useTransferPipelineOwnershipMutation,
  useVerifyPipelineUserQuery,
} from "../../redux/services/pipelineApi";
import { toast } from "react-toastify";
import { useGetUserQuery } from "../../redux/services/userApi";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PipelineUsersModel = ({ pipeline, setIsOpen }) => {
  const { data } = useVerifyPipelineUserQuery(pipeline._id);
  return (
    <section>
      <div className="p-5">
        <OwnerSection setIsOpen={setIsOpen} pipeline={pipeline} view={data} />
        <AssignedUsersSection pipeline={pipeline} view={data} />
      </div>
    </section>
  );
};
const OwnerSection = ({ pipeline, view, setIsOpen }) => {
  const { data, isLoading, isFetching, isSuccess, isError, error } =
    useGetUserQuery(pipeline.owner);
  const loggedUserId = useSelector((state) => state.auth.loggedUserId);

  const [
    transferOwnership,
    {
      isLoading: isTransferLoading,
      isSuccess: isTransferSuccess,
      isError: isTransferError,
      error: transferError,
    },
  ] = useTransferPipelineOwnershipMutation();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);

  async function handleTransferOwnershipe() {
    await transferOwnership({
      id: pipeline._id,
      newOwnerId: selectedUser.value,
    });
  }

  async function handleCanceTransfership() {
    setIsUserSelectOpen(false);
    selectedUser(null);
  }

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [isError]);

  useEffect(() => {
    if (isTransferSuccess) {
      setIsOpen(false);
      toast.success("Ownership transfered successfully");
    }
  }, [isTransferSuccess]);

  useEffect(() => {
    if (isTransferError) toast.error(transferError?.data?.message);
  }, [isTransferError]);

  return (
    <div>
      <h2 className="font-medium mb-2">Pipeline Owner</h2>
      {!isLoading && !isFetching && isSuccess ? (
        <Link to={"/users/" + data._id} className="input block">
          {data.fullname} {data._id === loggedUserId && "(You)"}
        </Link>
      ) : (
        <Skeleton variant="rectangular" height={30} sx={{ width: "100%" }} />
      )}
      {view && view?.userRole === "owner" && (
        <div className="mt-3">
          {!isUserSelectOpen && (
            <button
              disabled={view.userRole !== "owner"}
              onClick={() => setIsUserSelectOpen(true)}
              className="btn-outlined btn-small text-red-600"
            >
              Transfer Ownership
            </button>
          )}
          {isUserSelectOpen && (
            <div className="mt-4">
              <UserSelect
                selectedData={selectedUser}
                setSelectedData={setSelectedUser}
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  className="btn-filled btn-small"
                  disabled={!selectedUser}
                  onClick={handleTransferOwnershipe}
                >
                  {isTransferLoading ? "transferring" : "transfer"}
                </button>
                <button
                  className="btn-outlined btn-small"
                  onClick={handleCanceTransfership}
                >
                  cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AssignedUsersSection = ({ pipeline, view }) => {
  const [assignUser, { isLoading, isSuccess, isError, error }] =
    useAssignPipelineUserMutation();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);

  async function handleAssignUser() {
    await assignUser({
      id: pipeline._id,
      update: { newUserId: selectedUser.value },
    });
    setSelectedUser(null);
  }

  useEffect(() => {
    if (isSuccess)
      toast.success(selectedUser.label.split(" ") + " assigned to pipeline");
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [isError]);

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-3 font-medium">
          <Icon icon="teenyicons:users-solid" className="text-xl" />
          <span>Assigned Users</span>
        </h2>
        {!isUserSelectOpen && view?.userRole === "owner" && (
          <button
            onClick={() => setIsUserSelectOpen(true)}
            className="btn-filled btn-small shrink-0"
          >
            <Icon icon="uil:plus" className="text-xl" />
            Assign New
          </button>
        )}
      </div>
      {isUserSelectOpen && view?.userRole === "owner" && (
        <div className="mb-5">
          <UserSelect
            selectedData={selectedUser}
            setSelectedData={setSelectedUser}
          />
          <div className="flex items-center gap-2 mt-3">
            <button
              disabled={!selectedUser}
              onClick={handleAssignUser}
              className="btn-filled btn-small"
            >
              {isLoading ? "Loading..." : "Add User"}
            </button>
            <button
              onClick={() => setIsUserSelectOpen(false)}
              className="btn-outlined btn-small shrink-0"
            >
              <Icon icon="uil:times" className="text-xl" />
              Close
            </button>
          </div>
        </div>
      )}
      {pipeline?.assignees?.length !== 0 ? (
        <div>
          <table className="min-w-full border border-collapse text-left text-sm font-light">
            <thead className="border-b font-medium bg-paper">
              <tr>
                <th scope="col" className="p-3">
                  Name
                </th>
                <th scope="col" className="p-3">
                  Email
                </th>
                <th scope="col" className="p-3">
                  Deals Created
                </th>
                <th scope="col" className="p-3">
                  Activities Created
                </th>
                {view?.userRole === "owner" && (
                  <th scope="col" className="p-3">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {pipeline.assignees.map((assigneeId, i) => {
                return (
                  <AssigneeRow
                    key={i}
                    pipelineId={pipeline._id}
                    assigneeId={assigneeId}
                    view={view}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No assignees to show</p>
      )}
    </div>
  );
};
const AssigneeRow = ({ assigneeId, pipelineId, view }) => {
  const { data, isLoading, isFetching, isSuccess } =
    useGetUserQuery(assigneeId);

  const [
    removeUser,
    {
      isLoading: isRemoveLoading,
      isSuccess: isRemoveSuccess,
      isError: isRemoveError,
      error: removeError,
    },
  ] = useRemovePipelineUserMutation();

  async function handleRemoveUser() {
    await removeUser({ id: pipelineId, update: { userId: data._id } });
  }

  useEffect(() => {
    if (isRemoveSuccess) toast.success("User has been remove from pipeline");
  }, [isRemoveSuccess]);

  useEffect(() => {
    if (isRemoveError) toast.error(removeError?.data?.message);
  }, [isRemoveError]);

  return !isLoading && !isFetching && isSuccess ? (
    <tr className="border-b">
      <td className="capitalize p-3 font-medium">{data.fullname}</td>
      <td className="p-3">{data.email}</td>
      <td className="p-3">12</td>
      <td className="p-3">134</td>
      {view && view?.userRole === "owner" && (
        <td className="p-3">
          <button
            disabled={view.userRole !== "owner"}
            onClick={handleRemoveUser}
            className="btn-outlined btn-small"
          >
            {isRemoveLoading ? "Loading..." : "remove"}
          </button>
        </td>
      )}
    </tr>
  ) : (
    <tr className="border-b">
      <td className="p-3">
        <Skeleton variant="rectangular" height={20} sx={{ width: "100%" }} />
      </td>
      <td className="p-3">
        <Skeleton variant="rectangular" height={20} sx={{ width: "100%" }} />
      </td>
      <td className="p-3">
        <Skeleton variant="rectangular" height={20} sx={{ width: "100%" }} />
      </td>
      <td className="p-3">
        <Skeleton variant="rectangular" height={20} sx={{ width: "100%" }} />
      </td>
    </tr>
  );
};

export default PipelineUsersModel;
