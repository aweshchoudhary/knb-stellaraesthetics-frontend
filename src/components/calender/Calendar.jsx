import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useEffect, useState } from "react";
import Model from "../models/Model";
import Activity from "../activity/Activity";
import { useDispatch, useSelector } from "react-redux";
import {
  addActivity,
  updateActivity,
  deleteActivity,
  getAllActivities,
} from "../../state/features/dealFeatures/activitySlice";
import moment from "moment";
import { Icon } from "@iconify/react";
import ActivityPanel from "../activity/ActivityPanel";

const Calendar = () => {
  const [isActivityModelOpen, setIsActivityModelOpen] = useState(false);
  const [clickedActivityData, setClickedActivityData] = useState({});
  const { data, loading, success, error } = useSelector(
    (state) => state.activity
  );
  const dispatch = useDispatch();

  // const events = [{ title: "Meeting", start: "2023-04-17" }];
  const [events, setEvents] = useState([]);

  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: Date.now(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
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

  useEffect(() => {
    dispatch(getAllActivities());
  }, [dispatch]);

  useEffect(() => {
    const filteredActivities = [];
    data.forEach((event) => {
      filteredActivities.push({
        id: event._id,
        title: event.title,
        start: event.startDate,
        // end: event.endDate,
        // startTime: event.startTime,
        // endTime: event.endTime,
        type: event.type,
        markDone: event.markDone,
      });
    });
    setEvents(filteredActivities);
  }, [data]);
  return (
    <>
      {/* <Model
        isOpen={isActivityModelOpen}
        setIsOpen={setIsActivityModelOpen}
        title={"Create Activity"}
      >
        <Activity
          selectedInfo={selectedInfo}
          setIsOpen={setIsActivityModelOpen}
        />
      </Model> */}
      <Model
        title="Activity Panel"
        isOpen={isActivityModelOpen}
        setIsOpen={setIsActivityModelOpen}
      >
        <ActivityPanel
          data={clickedActivityData}
          setIsOpen={setIsActivityModelOpen}
        />
      </Model>
      <section className="py-5 w-full px-5">
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
  );
};

// a custom render function
function renderEventContent(eventInfo) {
  return <EventComponent eventInfo={eventInfo} />;
}

const EventComponent = ({ eventInfo }) => {
  const data = eventInfo?.event?.extendedProps;
  const [markDone, setMarkDone] = useState(data.markDone);
  const [icon, setIcon] = useState("");
  const dispatch = useDispatch();

  function handleMarkAsDone() {
    dispatch(
      updateActivity({
        id: eventInfo.event.id,
        update: { markDone: !markDone },
      })
    );
    setMarkDone(!markDone);
  }

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
    <div className="py-1 px-2 bg-primary w-full text-white flex items-center justify-between gap-2">
      <div className="flex gap-2">
        <span>
          <Icon className="text-lg" icon={icon} />
        </span>
        <span>
          {eventInfo.event.title.length > 20
            ? eventInfo.event.title.slice(0, 18) + "..."
            : eventInfo.event.title}
        </span>
      </div>
      {markDone ? (
        <span
          onClick={handleMarkAsDone}
          className="w-[18px] h-[18px] rounded-full bg-white text-primary"
        >
          <Icon icon="uil:check" className="text-lg" />
        </span>
      ) : (
        <span
          onClick={handleMarkAsDone}
          className="w-[18px] h-[18px] rounded-full border-2 hover:border-white"
        ></span>
      )}
    </div>
  );
};

export default Calendar;
