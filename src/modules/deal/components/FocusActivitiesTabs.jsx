import React, { Suspense, useState } from "react";
import { Icon } from "@iconify/react";
import moment from "moment";
import { Loader, Model } from "@/modules/common";
import {
  useGetActivitiesQuery,
  useUpdateActivityMutation,
} from "@/redux/services/activityApi";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ActivityDisplayModel, useActivityStatus } from "@/modules/deal";
import { Tooltip } from "@mui/material";

const FocusActivities = ({ dealId, contactId }) => {
  return (
    <Suspense>
      <div className="my-4">
        <header className="mb-3">
          <h2 className="text-lg font-medium">Focus Activity</h2>
        </header>
        <Activites dealId={dealId} contactId={contactId} />
      </div>
    </Suspense>
  );
};

const Activites = ({ dealId, contactId }) => {
  const { data, isLoading, isFetching, isSuccess } = useGetActivitiesQuery({
    filters: JSON.stringify([
      {
        id: "$or",
        value: [
          { dealId: { $in: [dealId] } },
          { contactId: { $in: [contactId] } },
        ],
      },
      { id: "completed_on", value: null },
    ]),
    data: true,
    populate: "performer contacts deals",
  });
  console.log(data);
  return !isLoading && !isFetching && isSuccess ? (
    <div>
      <ul>
        {data?.length ? (
          data?.map((activity, index) => {
            return (
              <li key={index}>
                <ActivityDeal data={activity} />
              </li>
            );
          })
        ) : (
          <section className="w-full h-[100px] bg-bg my-4 flex items-center justify-center">
            <p>No active activities to show</p>
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
  const [isDisplayModelOpen, setIsDisplayModelOpen] = useState(false);

  const [
    updateActivity,
    { isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError },
  ] = useUpdateActivityMutation();

  async function handleMarkDoneActivity() {
    await updateActivity({
      id: data._id,
      update: {
        completed_on: new Date(),
      },
    });
  }

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

  const ActivityStatus = ({ startDateTime, endDateTime }) => {
    const { status } = useActivityStatus(startDateTime, endDateTime);
    return (
      <>
        {status === "overdue" && (
          <p className="text-white bg-red-600 py-1 px-2 rounded-full">
            overdue
          </p>
        )}
        {status === "pending" && (
          <p className="text-white bg-yellow-600 py-1 px-2 rounded-full">
            pending
          </p>
        )}
      </>
    );
  };

  return (
    <>
      <Model
        title="Activity"
        isOpen={isDisplayModelOpen}
        setIsOpen={setIsDisplayModelOpen}
      >
        <ActivityDisplayModel data={data} />
      </Model>
      <div className="flex">
        <div className="w-[60px] flex flex-col items-center">
          <span className="w-[40px] h-[40px] bg-bg flex items-center justify-center">
            <Icon icon={"material-symbols:sticky-note-2-outline"} />
          </span>
        </div>
        <div className="bg-bg mb-2 p-3 text-sm flex flex-1 gap-2">
          <Tooltip title="Mark As Completed">
            <button
              className="w-[20px] h-[20px] rounded-full border-2 hover:border-textColor grow-0 shrink-0"
              onClick={handleMarkDoneActivity}
            ></button>
          </Tooltip>
          <button
            onClick={() => setIsDisplayModelOpen(true)}
            className="block text-left"
          >
            <header className="flex justify-between ">
              <div className="flex gap-2 items-center">
                <span className="capitalize font-medium text-textColor">
                  {data.title} On{" "}
                  {moment(data.startDateTime).format("DD-MM-YYYY HH:mm:ss")}
                </span>
              </div>
            </header>
            {data.description && <div className="my-2">{data.description}</div>}
            <div className="mt-1 flex items-center gap-3 text-xs text-textDark">
              <ActivityStatus
                startDateTime={data.startDateTime}
                endDateTime={data.endDateTime}
              />
              <span>{moment(data.startDateTime).fromNow()}</span>
              <span>Awesh Choudhary</span>
              {data.location && (
                <span className="flex items-center gap-1">
                  <Icon icon="material-symbols:location-on" />
                  {data.location}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default FocusActivities;
