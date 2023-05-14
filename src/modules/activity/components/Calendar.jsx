import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

import React, { Suspense, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  useGetActivitiesQuery,
  useUpdateActivityMutation,
} from "@/redux/services/activityApi";
import { Model } from "@/modules/common";
import { ActivityHandler, ActivityDisplayModel } from "@/modules/deal";
import moment from "moment";
import { Typography } from "@mui/material";

const Calendar = ({ weekDaysEnabled }) => {
  const [updateActivity, { isLoading: isActivityUpdating }] =
    useUpdateActivityMutation();

  const [isActivityModelOpen, setIsActivityModelOpen] = useState(false);
  const [isCreateActivityModelOpen, setIsCreateActivityModelOpen] =
    useState(false);
  const [clickedActivityData, setClickedActivityData] = useState({});
  const [selectedInfo, setSelectedInfo] = useState(null);
  const { data, isLoading, isFetching, isSuccess } = useGetActivitiesQuery({
    data: true,
    populate: "deals contacts performer",
  });
  const [events, setEvents] = useState([]);

  const handleDateSelect = (selectInfo) => {
    setIsCreateActivityModelOpen(true);
    setSelectedInfo(selectInfo);
  };

  const handleEventClick = (clickInfo) => {
    setClickedActivityData(clickInfo);
    setIsActivityModelOpen(true);
  };

  const handleEventDrop = async (eventInfo) => {
    const event = eventInfo.event;
    const updateData = {
      startDateTime: event.start,
      endDateTime: event.end,
    };
    await updateActivity({ id: event.id, update: updateData });
  };

  function filteredActivities() {
    const filteredActivitiesArr = [];
    const copyData = data && [...data];

    copyData.forEach((event) => {
      let today = moment();
      let startDate = moment(event.startDateTime).format("YYYY-MM-DD");
      let endDate = moment(event.endDateTime).format("YYYY-MM-DD");
      let backgroundColor;

      if (today.isAfter(endDate, "day")) backgroundColor = "bg-red-600"; // Red Color
      if (today.isBefore(startDate, "day")) backgroundColor = "bg-paper"; // Gray

      if (today.isAfter(startDate, "day") && today.isBefore(endDate, "day"))
        backgroundColor = "bg-yellow-600"; // Yellow Color

      if (event.completed_on) backgroundColor = "bg-primary";

      filteredActivitiesArr.push({
        id: event._id,
        title: event.title,
        start: event.startDateTime,
        end: event.endDateTime,
        backgroundColor,
        external: event,
      });
    });
    setEvents(filteredActivitiesArr);
    setIsActivityModelOpen(false);
    console.log(filteredActivitiesArr);
  }

  useEffect(() => {
    let isMounted = true;
    data?.length > 0 && isMounted && filteredActivities();
    return () => {
      isMounted = false;
    };
  }, [data]);

  return (
    isSuccess && (
      <Suspense>
        <Model
          isOpen={isCreateActivityModelOpen}
          setIsOpen={setIsCreateActivityModelOpen}
          title={"Create Activity"}
        >
          <ActivityHandler
            selectedInfo={selectedInfo}
            setIsOpen={setIsCreateActivityModelOpen}
          />
        </Model>
        <Model
          title="Activity Panel"
          isOpen={isActivityModelOpen}
          setIsOpen={setIsActivityModelOpen}
        >
          <ActivityDisplayModel
            data={clickedActivityData?.event?.extendedProps.external}
            setIsOpen={setIsActivityModelOpen}
          />
        </Model>
        <section
          className={`py-5 w-full px-2 text-sm ${
            !isLoading && !isFetching && !isActivityUpdating
              ? "opacity-100"
              : "opacity-50"
          }`}
        >
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={weekDaysEnabled}
            events={events}
            select={handleDateSelect}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventDrop}
          />
        </section>
      </Suspense>
    )
  );
};

// a custom render function
function renderEventContent(eventInfo) {
  return <EventComponent eventInfo={eventInfo} />;
}

const EventComponent = ({ eventInfo }) => {
  const data = eventInfo?.event?.extendedProps;
  const [icon, setIcon] = useState("");
  useEffect(() => {
    switch (data.type) {
      case "call":
        setIcon("uil:phone");
        break;
      case "meeting":
        setIcon("uil:users");
        break;
      case "email":
        setIcon("uil:envelope");
        break;
      case "task":
        setIcon("uil:envelope");
        break;

      default:
        break;
    }
  }, [data]);
  return (
    <>
      <div
        className={
          "flex justify-between w-full gap-2 text-inherit px-2 py-1 " +
          eventInfo?.backgroundColor
        }
      >
        <div className="flex w-[calc(100%-20px)] gap-1">
          <div>
            <Icon className="text-lg" icon={icon || "mdi:calendar-task"} />
          </div>
          <Typography noWrap variant="p" className="flex-1 text-xs">
            {eventInfo.event.title}
          </Typography>
        </div>
        {data?.completed_on ? (
          <div className="w-[18px] h-[18px] shrink-0 rounded-full bg-primary">
            <Icon icon="uil:check" className="text-lg" />
          </div>
        ) : (
          <div className="w-[18px] h-[18px] shrink-0 rounded-full border-2"></div>
        )}
      </div>
    </>
  );
};

export default Calendar;
