import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import Model from "../models/Model";
import { Icon } from "@iconify/react";
import ActivityEditPanel from "../tabs/ActivityEditPanel";
import { useGetAllActivitiesQuery } from "../../services/activityApi";
import EventHandler from "../tabs/EventHandler";

const Calendar = () => {
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

  // const events = [{ title: "Meeting", start: "2023-04-17" }];
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

  function filteredActivities() {
    const filteredActivitiesArr = [];
    const copyData = [...data];
    copyData.forEach((event) => {
      filteredActivitiesArr.push({
        id: event._id,
        title: event.title,
        start: event.startDate,
        type: event.type,
        markDone: event.markDone,
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
          className={`py-5 w-full px-5 ${
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
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={false}
            events={events}
            // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
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
      <div className="py-1 px-2 w-full border flex items-center justify-between hover:bg-gray-50 gap-2">
        <div className="flex gap-2">
          <span>
            <Icon className="text-lg" icon={icon} />
          </span>
          <span>
            {eventInfo.event.title.length > 20
              ? eventInfo.event.title.slice(0, 18) + "..."
              : eventInfo.event.title}
          </span>
          {data?.markDone ? (
            <span className="w-[18px] h-[18px] rounded-full bg-primary text-white">
              <Icon icon="uil:check" className="text-lg" />
            </span>
          ) : (
            <span className="w-[18px] h-[18px] rounded-full border-2"></span>
          )}
        </div>
      </div>
    </>
  );
};

export default Calendar;
