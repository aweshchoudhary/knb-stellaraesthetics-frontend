import { useEffect, useState } from "react";
import moment from "moment";

const useActivityStatus = (startDateTime, endDateTime) => {
  const [status, setStatus] = useState("none");

  const getActivityStatus = () => {
    const today = moment();
    const startDate = moment(startDateTime).format("YYYY-MM-DD");
    const endDate = moment(endDateTime).format("YYYY-MM-DD");

    if (today.isBefore(startDate, "day")) {
      setStatus("none");
    } else if (today.isBefore(endDate, "day")) {
      setStatus("pending");
    } else {
      setStatus("overdue");
    }
  };

  useEffect(() => {
    if (startDateTime && endDateTime) {
      getActivityStatus();
    }
  }, [startDateTime, endDateTime]);

  return { status, getActivityStatus };
};

export default useActivityStatus;
