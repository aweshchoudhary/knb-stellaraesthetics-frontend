import { useDeleteActivityMutation } from "@/redux/services/activityApi";
import { Icon } from "@iconify/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ActivityDisplayModel = ({ data, setIsOpen }) => {
  const [deleteActivity, { isLoading, isError, isSuccess, error }] =
    useDeleteActivityMutation();

  async function handledDeleteActivity() {
    await deleteActivity(data._id);
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
          <h2 className="w-full text-lg font-medium flex items-center gap-2">
            <Icon icon="ic:phone" className="text-2xl" />
            <span>{data.title}</span>
          </h2>
          <p className="my-4 input">{data.description}</p>
          {data.location && (
            <p className="flex input gap-2 my-4 items-center capitalize">
              <Icon icon="material-symbols:location-on" className="text-xl" />
              <span>{data.location}</span>
            </p>
          )}
          {data.taskUrl && (
            <p className="flex gap-2 items-center capitalize">
              <Icon icon="material-symbols:link" className="text-xl" />
              <a href={data.taskUrl} className="text-blue-600 hover:underline">
                {data.taskUrl}
              </a>
            </p>
          )}
          <div className="text-sm flex items-center gap-3">
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
          <div className="mt-5">
            <p>
              <span>Created: {moment(data.createdAt).fromNow()}</span>
            </p>
          </div>
        </section>
        <footer className="modal-footer mt-5">
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
        </footer>
      </>
    )
  );
};

const ActivityStatus = ({ startDateTime, endDateTime }) => {
  const [status, setStatus] = useState("none");

  useEffect(() => {
    let today = moment();
    let endDate = moment(endDateTime).format("YYYY-MM-DD");
    let startDate = moment(startDateTime).format("YYYY-MM-DD");

    if (today.isBefore(endDate, "day")) setStatus("none");
    if (today.isBefore(endDate, "day") && today.isAfter(startDate, "day"))
      setStatus("pending");
    if (today.isAfter(endDate, "day")) setStatus("overdue");
  }, [startDateTime, endDateTime]);
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
        <div className="w-fit text-white bg-paper py-1 px-2 rounded-full">
          Not Started
        </div>
      )}
    </>
  );
};

export default ActivityDisplayModel;
