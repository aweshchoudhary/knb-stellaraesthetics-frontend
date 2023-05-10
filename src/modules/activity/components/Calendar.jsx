import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, { Suspense, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  useGetActivitiesQuery,
  useUpdateActivityMutation,
} from "@/redux/services/activityApi";
import { Model } from "@/modules/common";
import { ActivityDisplayModel, ActivityHandler } from "@/modules/deal";

const Calendar = () => {
  const [updateActivity, { isLoading: isActivityUpdating }] =
    useUpdateActivityMutation();

  const [isActivityModelOpen, setIsActivityModelOpen] = useState(false);
  const [isCreateActivityModelOpen, setIsCreateActivityModelOpen] =
    useState(false);
  const [clickedActivityData, setClickedActivityData] = useState({});
  const [selectedInfo, setSelectedInfo] = useState(null);
  const { data, isLoading, isFetching, isSuccess } = useGetActivitiesQuery({
    data: true,
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
    const copyData = data?.data && [...data.data];
    copyData.forEach((event) => {
      filteredActivitiesArr.push({
        id: event._id,
        title: event.title,
        start: event.startDateTime,
        end: event.endDateTime,
        type: event.type,
        markDone: event.markDone,
        location: event.location,
        description: event.description,
      });
    });
    setEvents(filteredActivitiesArr);
    // refetch();
    setIsActivityModelOpen(false);
  }
  useEffect(() => {
    let isMounted = true;
    data?.data?.length > 0 && isMounted && filteredActivities();
    return () => {
      isMounted = false;
    };
  }, [data?.data]);

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
            data={clickedActivityData}
            setIsOpen={setIsActivityModelOpen}
          />
        </Model>

        <section
          className={`py-5 w-full px-5 text-sm ${
            !isLoading && !isFetching && !isActivityUpdating
              ? "opacity-100"
              : "opacity-50"
          }`}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
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
      <div className="flex justify-between w-full">
        <div className="flex gap-2">
          <span>
            <Icon className="text-lg" icon={icon} />
          </span>
          <span>
            {eventInfo.event.title.length > 20
              ? eventInfo.event.title.slice(0, 12) + "..."
              : eventInfo.event.title}
          </span>
        </div>
        {data?.markDone ? (
          <span className="w-[18px] h-[18px] shrink-0 rounded-full bg-primary text-white">
            <Icon icon="uil:check" className="text-lg" />
          </span>
        ) : (
          <span className="w-[18px] h-[18px] shrink-0 rounded-full border-2"></span>
        )}
      </div>
    </>
  );
};

export default Calendar;