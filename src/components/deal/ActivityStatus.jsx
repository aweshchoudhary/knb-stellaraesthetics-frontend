import { Icon } from "@iconify/react";
import { useGetActivitiesByCardIdQuery } from "../../services/activityApi";
import { useEffect, useState } from "react";
import moment from "moment";
import { Tooltip } from "@mui/material";

const ActivityStatus = ({ cardId }) => {
  const {
    data = [],
    isLoading,
    isFetching,
    isSuccess,
  } = useGetActivitiesByCardIdQuery(cardId);
  const [status, setStatus] = useState("nothing");

  useEffect(() => {
    if (!data.length) {
      return setStatus("nothing");
    }
    let isOverdue = false;
    data.forEach((item) => {
      isOverdue = moment(item.endDate).isAfter();
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
      <>
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
            <button className="border p-1 flex items-center justify-center bg-red-600 rounded-full">
              <Icon
                icon="material-symbols:keyboard-arrow-left"
                className="text-white text-lg"
              />
            </button>
          </Tooltip>
        )}
        {status === "active" && (
          <Tooltip title="Perform Activity">
            <button className="border p-1 flex items-center justify-center bg-green-600 rounded-full">
              <Icon
                icon="material-symbols:keyboard-arrow-right"
                className="text-white text-lg"
              />
            </button>
          </Tooltip>
        )}
      </>
    )
  );
};

export default ActivityStatus;