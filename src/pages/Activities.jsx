import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import Header from "../components/global/Header";
import Model from "../components/models/Model";
import Activity from "../components/deal/Activity";

const Activities = () => {
  const [events, setEvents] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [isActivityModelOpen, setIsActivityModelOpen] = useState(false);

  const handleWeekendsToggle = () => {
    setWeekendsVisible((prev) => !prev);
  };

  const handleDateSelect = (selectInfo) => {
    setIsActivityModelOpen(true);
    setSelectedInfo(selectInfo);
    // const title = prompt("Please enter a new title for your event");
    // const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: String(Date.now()),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay,
    //   });
    // }
  };

  const handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  const handleEvents = (events) => {
    setEvents(events);
  };

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }

  return (
    <>
      <Header title="Activities" />
      <Model
        isOpen={isActivityModelOpen}
        setIsOpen={setIsActivityModelOpen}
        title={"Activity"}
      >
        <Activity selectedInfo={selectedInfo} />
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
          weekends={weekendsVisible}
          // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
        />
      </section>
    </>
  );
};

export default Activities;
