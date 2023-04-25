import { Icon } from "@iconify/react";
import { useGetActivitiesByCardIdQuery } from "../../services/activityApi";
import { useEffect, useState } from "react";
import moment from "moment";

const ActivityStatus = ({ cardId }) => {
  const {
    data = [],
    isLoading,
    isFetching,
    isSuccess,
  } = useGetActivitiesByCardIdQuery(cardId);
  const [status, setStatus] = useState("noActivity");

  useEffect(() => {
    if (!data.length) {
      return setStatus("noActivity");
    }
    // let isOverdue = moment(data[0].)
  }, [data]);
  return (
    !isLoading &&
    !isFetching &&
    isSuccess && (
      <>
        {status === "noActivity" && (
          <button className="border p-1 flex items-center justify-center hover:bg-gray-100 rounded-full">
            <Icon icon="icon-park-solid:caution" className="text-yellow-500" />
          </button>
        )}
      </>
    )
  );
};

export default ActivityStatus;
