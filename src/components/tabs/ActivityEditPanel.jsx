import { Icon } from "@iconify/react";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  deleteActivity,
  updateActivity,
} from "../../state/features/dealFeatures/activitySlice";
import { useState } from "react";

const ActivityPanel = ({ data }) => {
  const custom = data?.event?.extendedProps;
  const [markDone, setMarkDone] = useState(custom.markDone);
  const dispatch = useDispatch();
  function handleMarkAsDone() {
    dispatch(
      updateActivity({
        id: data.event.id,
        update: { markDone: !markDone },
      })
    );
    setMarkDone(!markDone);
  }
  function handleDeleteActivity() {
    dispatch(deleteActivity(data.event.id));
  }

  return (
    <div>
      <ul className="p-5">
        <li className="flex items-center gap-5 mb-4">
          <Icon icon="bx:phone" className="text-2xl" />
          <h2 className="text-lg font-medium">{data.event.title}</h2>
        </li>
        <li className="flex items-center gap-5 mb-4">
          <span className="flex gap-2 items-center">
            <Icon icon="bx:user" className="text-2xl" />
            <span>(Holder):</span>
          </span>
          <span>Awesh Choudhary</span>
        </li>
        <li className="flex items-center gap-5 mb-4">
          <span className="flex gap-2 items-center">
            <Icon icon="bx:calendar" className="text-2xl" />
            <span>(Date):</span>
          </span>
          <span>
            {moment(data.event.startStr).format("dddd, MMMM Do YYYY, (H:MM A)")}
          </span>
        </li>
      </ul>
      <footer className="px-5 py-2 border-t flex justify-between">
        <button className="btn-outlined btn-small" onClick={handleMarkAsDone}>
          {markDone ? "Mark As Undone" : "Mark As Done"}
        </button>
        <div className="flex gap-2 justify-end">
          <button onClick={handleDeleteActivity} className="btn-outlined">
            <Icon icon="uil:trash" className="text-xl" />
          </button>
          <button className="btn-filled">
            <Icon icon="uil:pen" className="" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ActivityPanel;
