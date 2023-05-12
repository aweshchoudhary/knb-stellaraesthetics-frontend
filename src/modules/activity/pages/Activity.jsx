import React, { Suspense, useState } from "react";
import { Calendar } from "@/modules/activity";
import { ActivityHandler } from "@/modules/deal";
import { Header, Model } from "@/modules/common";
import { Icon } from "@iconify/react";
import { Switch } from "@mui/material";

const ActivityCalendar = () => {
  const [weekDays, setWeekDays] = useState(true);
  const [isCreateActivityModelOpen, setIsActivityModelOpen] = useState(false);
  return (
    <>
      <Header title="Activities" />
      <header className="px-5 py-2 border-b flex items-center justify-between">
        <div>
          <Switch
            aria-label="Weekdays"
            checked={weekDays}
            onChange={() => setWeekDays(!weekDays)}
          />
          <span>Weekdays</span>
        </div>
        <button
          onClick={() => setIsActivityModelOpen(true)}
          className="btn-filled btn-small"
        >
          <Icon icon="uil:plus" className="text-lg" />
          <span>Event</span>
        </button>
      </header>
      <section>
        <Calendar weekDaysEnabled={weekDays} />
      </section>
      <Suspense>
        {isCreateActivityModelOpen && (
          <Model
            title="Create Activity"
            isOpen={isCreateActivityModelOpen}
            setIsOpen={setIsActivityModelOpen}
          >
            <ActivityHandler setIsOpen={setIsActivityModelOpen} />
          </Model>
        )}
      </Suspense>
    </>
  );
};

export default ActivityCalendar;
