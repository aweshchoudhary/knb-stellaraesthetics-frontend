import React, { Suspense, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useGetActivitiesQuery } from "@/redux/services/activityApi";
import moment from "moment";
import { Tooltip } from "@mui/material";

const ActivityStatus = ({ dealId }) => {
  const {
    data = [],
    isLoading,
    isFetching,
    isSuccess,
  } = useGetActivitiesQuery({
    filters: JSON.stringify([{ id: "deals", value: { $in: [dealId] } }]),
    select: "_id endDateTime",
    data: true,
  });
  const [status, setStatus] = useState("nothing");
  useEffect(() => {
    if (!data.length) {
      return setStatus("nothing");
    }
    let isOverdue = false;
    data.forEach((item) => {
      isOverdue = moment(item.endDateTime).isBefore();
    });
    if (isOverdue) {
      setStatus("overdue");
    } else {
      setStatus("active");
    }
  }, [data]);
  return (
    !isLoading &&
    !isFetching &&
    isSuccess && (
      <Suspense>
        {status === "nothing" && (
          <Tooltip title="Schedule Activity">
            <button className="border p-1 flex items-center justify-center hover:bg-bg rounded-full">
              <Icon
                icon="icon-park-solid:caution"
                className="text-yellow-600"
              />
            </button>
          </Tooltip>
        )}
        {status === "overdue" && (
          <Tooltip title="Overdue Activity">
            <button className="p-1 flex items-center justify-center bg-red-600 rounded-full">
              <Icon
                icon="material-symbols:keyboard-arrow-left"
                className="text-white"
              />
            </button>
          </Tooltip>
        )}
        {status === "active" && (
          <Tooltip title="Perform Activity">
            <button className="border p-1 flex items-center justify-center bg-green-600 rounded-full">
              <Icon
                icon="material-symbols:keyboard-arrow-right"
                className="text-white"
              />
            </button>
          </Tooltip>
        )}
      </Suspense>
    )
  );
};

export default ActivityStatus;
