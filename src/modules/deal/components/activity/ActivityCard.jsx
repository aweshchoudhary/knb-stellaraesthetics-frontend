import { Model } from "@/modules/common";
import { Icon } from "@iconify/react";
import moment from "moment";
import React, { Suspense, useState } from "react";
import ActivityDisplayModel from "./ActivityDisplayModel";

const ActivityCard = ({ activity }) => {
  const [isDisplayModelOpen, setIsDisplayModelOpen] = useState(false);
  return (
    <Suspense>
      {isDisplayModelOpen && (
        <Model
          title="Activity"
          isOpen={isDisplayModelOpen}
          setIsOpen={setIsDisplayModelOpen}
        >
          <ActivityDisplayModel
            data={activity}
            setIsOpen={setIsDisplayModelOpen}
          />
        </Model>
      )}
      <button
        onClick={() => setIsDisplayModelOpen(true)}
        className="w-full text-left flex my-2 gap-2"
      >
        <div className="w-[40px] h-[40px] bg-bg flex items-center justify-center">
          <div>
            <Icon
              icon="material-symbols:timer-outline-rounded"
              className="text-lg"
            />
          </div>
        </div>
        <div className="flex-1 h-full flex flex-col bg-bg p-2 text-sm">
          <div className="flex-1 flex items-center gap-2">
            <div className="w-[22px] h-[22px] rounded-full bg-primary text-white flex items-center justify-center">
              <Icon icon="uil:check" className="text-xl" />
            </div>
            <h2 className="text-md font-medium">{activity.title}</h2>
          </div>
          <div className="mt-2 text-textDark flex gap-3 items-center justify-between text-xs">
            <div className="flex gap-3 items-center">
              <span className="bg-green-600 py-1 px-2 rounded-full text-white">
                Completed
              </span>
              <span>
                {activity.completed_on
                  ? moment(activity.completed_on).fromNow()
                  : moment(activity.createdAt).fromNow()}
              </span>
              <span>{activity?.performer?.fullname}</span>
            </div>
          </div>
        </div>
      </button>
    </Suspense>
  );
};

export default ActivityCard;
