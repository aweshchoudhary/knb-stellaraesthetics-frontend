import {
  useDeleteActivityMutation,
  useUpdateActivityMutation,
} from "@/redux/services/activityApi";
import { Icon } from "@iconify/react";
import moment from "moment";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useActivityStatus } from "@/modules/deal";

const ActivityDisplayModel = ({ data, setIsOpen }) => {
  const [deleteActivity, { isLoading, isError, isSuccess, error }] =
    useDeleteActivityMutation();

  const [updateActivity] = useUpdateActivityMutation();

  async function handledDeleteActivity() {
    await deleteActivity(data._id);
  }

  async function handleMarkCompleted() {
    await updateActivity({
      id: data._id,
      update: { completed_on: new Date() },
    });
    setIsOpen(false);
  }
  async function handleUndoCompleted() {
    await updateActivity({ id: data._id, update: { completed_on: null } });
    setIsOpen(false);
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Activity deleted successfully");
      setIsOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) toast.error(error.data?.message);
  }, [isError]);

  return (
    data && (
      <>
        <section className="p-10 pb-0">
          <h2 className="w-full border-b pb-3 text-lg font-medium flex items-center gap-2 mb-5">
            <Icon icon="ic:phone" className="text-2xl" />
            <span>{data.title}</span>
          </h2>
          {data.description && <p className="mb-5 input">{data.description}</p>}
          {data.location && (
            <p className="flex input gap-2 mb-5 items-center capitalize">
              <Icon icon="material-symbols:location-on" className="text-xl" />
              <span>{data.location}</span>
            </p>
          )}
          {data.taskUrl && (
            <p className="flex gap-2 mb-5 items-center capitalize">
              <Icon icon="material-symbols:link" className="text-xl" />
              <a href={data.taskUrl} className="text-blue-600 hover:underline">
                {data.taskUrl}
              </a>
            </p>
          )}
          <div className="text-sm flex items-center mb-5 gap-3">
            <ActivityStatus
              startDateTime={data.startDateTime}
              endDateTime={data.endDateTime}
            />
            <Link
              to={"/users/" + data?.performer?._id}
              className="hover:text-blue-600 hover:underline"
            >
              <p className="flex gap-2 items-center capitalize">
                <Icon icon="uil:user" className="text-xl" />
                {data?.performer?.fullname}
              </p>
            </Link>
            <p>
              <span>
                Start: {moment(data.startDateTime).format("HH:mm - DD-MM-YYYY")}
              </span>
            </p>
            <p>
              <span>
                End: {moment(data.endDateTime).format("HH:mm - DD-MM-YYYY")}
              </span>
            </p>
          </div>
          <div className="mb-5">
            <p>
              <span>Created: {moment(data.createdAt).fromNow()}</span>
            </p>
          </div>

          <div className="mb-3">
            <h2 className="text-lg mb-2">Deals</h2>
            <p className="flex items-center gap-3">
              <span className="input">
                {data?.deals?.map((deal) => {
                  return deal.title;
                })}
              </span>
            </p>
          </div>
          <div>
            <h2 className="text-lg mb-2">Contacts</h2>
            <p className="flex items-center gap-3">
              <span className="input">
                {data?.contacts?.map((contact) => {
                  return contact.contactPerson;
                })}
              </span>
            </p>
          </div>
        </section>
        <footer className="modal-footer mt-5 justify-between">
          {data.completed_on ? (
            <button
              onClick={handleUndoCompleted}
              className="btn-outlined btn-small"
            >
              Undo
            </button>
          ) : (
            <button
              onClick={handleMarkCompleted}
              className="btn-outlined btn-small"
            >
              Mark Completed
            </button>
          )}
          <div className="flex gap-2">
            <button
              disabled={isLoading}
              onClick={handledDeleteActivity}
              className="btn-filled bg-red-600 border-red-600 btn-small"
            >
              <Icon icon="uil:trash" />
              <span>{isLoading ? "Deleting..." : "Delete"}</span>
            </button>
            <button disabled={isLoading} className="btn-filled btn-small">
              <Icon icon="uil:pen" />
              <span>Edit</span>
            </button>
          </div>
        </footer>
      </>
    )
  );
};

const ActivityStatus = ({ startDateTime, endDateTime }) => {
  const { status } = useActivityStatus(startDateTime, endDateTime);
  return (
    <>
      {status === "overdue" && (
        <div className="w-fit text-white bg-red-600 py-1 px-2 rounded-full">
          overdue
        </div>
      )}
      {status === "pending" && (
        <div className="w-fit text-white bg-yellow-600 py-1 px-2 rounded-full">
          pending
        </div>
      )}
      {status === "none" && (
        <div className="w-fit text-white bg-textDark py-1 px-2 rounded-full">
          Not Started
        </div>
      )}
    </>
  );
};

export default ActivityDisplayModel;
