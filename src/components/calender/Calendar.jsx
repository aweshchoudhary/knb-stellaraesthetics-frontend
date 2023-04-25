import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import Model from "../models/Model";
import { Icon } from "@iconify/react";
import ActivityEditPanel from "../tabs/ActivityEditPanel";
import {
  useGetAllActivitiesQuery,
  useUpdateActivityMutation,
} from "../../services/activityApi";
import EventHandler from "../tabs/EventHandler";

const Calendar = () => {
  const [
    updateActivity,
    // { isLoading: isActivityUpdating, isSuccess: isActivitySuccess },
  ] = useUpdateActivityMutation();

  const [isActivityModelOpen, setIsActivityModelOpen] = useState(false);
  const [isCreateActivityModelOpen, setIsCreateActivityModelOpen] =
    useState(false);
  const [clickedActivityData, setClickedActivityData] = useState({});
  const [selectedInfo, setSelectedInfo] = useState(null);
  const {
    data = [],
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useGetAllActivitiesQuery();
  // console.log(data);
  const [events, setEvents] = useState([]);

  const handleDateSelect = (selectInfo) => {
    setIsCreateActivityModelOpen(true);
    setSelectedInfo(selectInfo);
    // let title = prompt("Please enter a new title for your event");
    // let calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: Date.now(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay,
    //   });
    // }
  };

  const handleEventClick = (clickInfo) => {
    setClickedActivityData(clickInfo);
    setIsActivityModelOpen(true);

    // // console.log(clickInfo);
    // if (
    //   confirm(
    //     `Are you sure you want to delete the event '${clickInfo.event.title}'`
    //   )
    // ) {
    //   clickInfo.event.remove();
    // }
  };

  const handleEvents = (events) => {
    // setEvents(events);
  };
  const handleEventDrop = async (eventInfo) => {
    const event = eventInfo.event;
    const updateData = {
      startDate: event.start,
      endDate: event.end,
    };
    await updateActivity({ id: event.id, update: updateData });
  };

  function filteredActivities() {
    const filteredActivitiesArr = [];
    const copyData = [...data];
    copyData.forEach((event) => {
      filteredActivitiesArr.push({
        id: event._id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        type: event.type,
        markDone: event.markDone,
        location: event.location,
        description: event.description,
      });
    });
    setEvents(filteredActivitiesArr);
    refetch();
    setIsActivityModelOpen(false);
  }
  useEffect(() => {
    let isMounted = true;
    data.length > 0 && isMounted && filteredActivities();
    return () => {
      isMounted = false;
    };
  }, [data]);

  return (
    isSuccess && (
      <>
        <Model
          isOpen={isCreateActivityModelOpen}
          setIsOpen={setIsCreateActivityModelOpen}
          title={"Create Activity"}
        >
          <EventHandler
            selectedInfo={selectedInfo}
            setIsOpen={setIsCreateActivityModelOpen}
          />
        </Model>
        <Model
          title="Activity Panel"
          isOpen={isActivityModelOpen}
          setIsOpen={setIsActivityModelOpen}
        >
          <ActivityEditPanel
            data={clickedActivityData}
            setIsOpen={setIsActivityModelOpen}
          />
        </Model>

        <section
          className={`py-5 w-full px-5 text-sm ${
            !isLoading && !isFetching ? "opacity-100" : "opacity-50"
          }`}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            eventDrop={handleEventDrop}
            eventResize={handleEventDrop}
          />
        </section>
      </>
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
