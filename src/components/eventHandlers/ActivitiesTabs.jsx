import React from "react";
import { Icon } from "@iconify/react";
import moment from "moment";
import Loader from "../global/Loader";
import {
  useGetActivitiesQuery,
  useDeleteActivityMutation,
  useUpdateActivityMutation,
} from "../../redux/services/activityApi";
import { useEffect } from "react";
import { toast } from "react-toastify";

const FocusActivities = ({ dealId }) => {
  return (
    <div className="my-4">
      <header className="mb-3">
        <h2 className="text-lg font-medium">Focus Activity</h2>
      </header>
      <Activites dealId={dealId} />
    </div>
  );
};

const Activites = ({ dealId }) => {
  const { data, isLoading, isFetching, isSuccess } = useGetActivitiesQuery({
    dataFilters: { dealId },
    data: true,
  });

  return !isLoading && !isFetching && isSuccess ? (
    <div>
      <ul>
        {data?.data?.length ? (
          data?.data?.map((activity, index) => {
            return (
              <li key={index}>
                <ActivityDeal data={activity} />
              </li>
            );
          })
        ) : (
          <section className="w-full h-[100px] bg-bg my-4 flex items-center justify-center">
            <p>No notes to show</p>
          </section>
        )}
      </ul>
    </div>
  ) : (
    <section className="w-full h-[100px] bg-bg my-4 flex items-center justify-center">
      <Loader />
    </section>
  );
};

const ActivityDeal = ({ data }) => {
  const [
    deleteActivity,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      error: deleteError,
    },
  ] = useDeleteActivityMutation();
  const [
    updateActivity,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateActivityMutation();

  async function handleDeleteActivity() {
    await deleteActivity(data._id);
  }

  async function handleMarkDoneActivity() {
    await updateActivity({
      id: data._id,
      update: {
        markDone: true,
      },
    });
  }

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Activity deleted successfully");
    }
  }, [isDeleteSuccess]);

  useEffect(() => {
    if (isDeleteError) {
      toast.success(deleteError.data?.message);
    }
  }, [isDeleteError]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Activity updated successfully");
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isUpdateError) {
      toast.success(updateError.data?.message);
    }
  }, [isUpdateError]);

  return (
    <div className="flex">
      <div className="w-[60px] flex flex-col items-center">
        <span className="w-[40px] h-[40px] rounded-full bg-bg flex items-center justify-center">
          <Icon icon={"material-symbols:sticky-note-2-outline"} />
        </span>
        <div className="line border-l-2 flex-1"></div>
      </div>
      <div className="bg-bg mb-2 p-3 text-sm flex-1">
        <header className="flex items-center justify-between ">
          <div className="flex gap-2 items-center">
            <button
              className="w-[15px] h-[15px] rounded-full border-2 hover:border-textColor grow-0 shrink-0"
              onClick={handleMarkDoneActivity}
              title="Mark Done"
            ></button>
            <span className="capitalize font-medium text-lg text-textColor">
              {data.title}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              className="btn-outlined btn-small"
              disabled={isDeleteLoading || isUpdateLoading}
            >
              <Icon icon={"uil:pen"} />
            </button>
            <button
              className="btn-outlined btn-small"
              onClick={handleDeleteActivity}
              disabled={isDeleteLoading || isUpdateLoading}
            >
              <Icon icon={"uil:trash"} />
            </button>
          </div>
        </header>
        <div className="mt-2">
          {data.description && <div className="mb-2">{data.description}</div>}
          <div className="flex gap-3 text-sm ">
            <span>{moment(data.endDate).fromNow()}</span>
            <span>Awesh Choudhary</span>
            {data.location && (
              <span className="flex items-center gap-1">
                <Icon icon="material-symbols:location-on" />
                {data.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusActivities;
