import { Icon } from "@iconify/react";
import moment from "moment";
import React, { Suspense, useState } from "react";
import {
  useDeleteActivityMutation,
  useUpdateActivityMutation,
} from "@/redux/services/activityApi";
import { Model } from "@/modules/common";
import { ActivityHandler } from "@/modules/deal";

const ActivityPanel = ({ data }) => {
  const [updateActivity] = useUpdateActivityMutation();
  const [deleteActivity] = useDeleteActivityMutation();
  const custom = data?.event?.extendedProps;
  const [markDone, setMarkDone] = useState(custom.markDone);
  const [isActivityUpdateModelOpen, setIsActivityUpdateModelOpen] =
    useState(false);
  async function handleMarkAsDone() {
    await updateActivity({
      id: data.event.id,
      update: { markDone: !markDone },
    });
    setMarkDone(!markDone);
  }
  async function handleDeleteActivity() {
    await deleteActivity(data.event.id);
  }

  return (
    <Suspense>
      <Model
        title="Activity Panel"
        isOpen={isActivityUpdateModelOpen}
        setIsOpen={setIsActivityUpdateModelOpen}
      >
        <ActivityHandler
          activityId={data.event.id}
          setIsOpen={setIsActivityUpdateModelOpen}
          isUpdate={true}
        />
      </Model>

      <ul className="p-5">
        <li className="flex items-center gap-5 mb-4">
          <Icon icon="bx:phone" className="text-2xl" />
          <h2 className="text-lg font-medium">{data.event.title}</h2>
        </li>
        <li className="flex items-center gap-5 mb-4">
          <span className="flex gap-2 items-center">
            <Icon icon="bx:user" className="text-2xl" />
            <span>Holder:</span>
          </span>
          <span>Awesh Choudhary (You)</span>
        </li>
        <li className="flex items-center gap-5 mb-4">
          <span className="flex gap-2 items-center">
            <Icon icon="bx:calendar" className="text-2xl" />
            <span>Date:</span>
          </span>
          <span>
            {moment(data.event.startStr).format("dddd, MMMM Do YYYY, (H:MM A)")}
          </span>
        </li>
        {custom.location && (
          <li className="flex items-center gap-5 mb-4">
            <span className="flex gap-2 items-center">
              <Icon icon="material-symbols:location-on" className="text-2xl" />
              <span>Location:</span>
            </span>
            <span>{custom.location}</span>
          </li>
        )}
        {custom.description && (
          <li className="flex items-center gap-5 mb-4">
            <span className="flex gap-2 items-center">
              <Icon icon="uil:bars" className="text-2xl" />
              <span>Description:</span>
            </span>
            <span>{custom.description}</span>
          </li>
        )}
      </ul>
      <footer className="px-5 py-2 border-t flex justify-between">
        <button className="btn-outlined btn-small" onClick={handleMarkAsDone}>
          {markDone ? "Mark As Undone" : "Mark As Done"}
        </button>
        <div className="flex gap-2 justify-end">
          <button onClick={handleDeleteActivity} className="btn-outlined">
            <Icon icon="uil:trash" className="text-xl" />
          </button>
          <button
            className="btn-filled"
            onClick={() => setIsActivityUpdateModelOpen(true)}
          >
            <Icon icon="uil:pen" className="" />
          </button>
        </div>
      </footer>
    </Suspense>
  );
};

export default ActivityPanel;
