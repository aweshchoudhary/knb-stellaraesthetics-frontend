import Calendar from "../components/calender/Calendar";
import Header from "../components/global/Header";

const ActivityCalendar = () => {
  return (
    <>
      <Header title="Activities" />
      <section>
        <Calendar />
      </section>
    </>
  );
};

export default ActivityCalendar;
