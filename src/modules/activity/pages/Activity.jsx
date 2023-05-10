import { Calendar } from "@/modules/activity";
import { Header } from "@/modules/common";

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
