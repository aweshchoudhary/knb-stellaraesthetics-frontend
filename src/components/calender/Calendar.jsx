import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import Model from "../models/Model";
import Activity from "../deal/Activity";
import { useDispatch, useSelector } from "react-redux";
import {
  addActivity,
  updateActivity,
  deleteActivity,
  getAllActivities,
} from "../../state/features/dealFeatures/activitySlice";

const Calendar = () => {
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
      <section className="py-5 w-full px-5"></section>
    </>
  );
};

export default Calendar;
