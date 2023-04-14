import Calendar from "../components/calender/Calendar";
import Header from "../components/global/Header";

const Activities = () => {
  return (
    <>
      <Header title="Activities" />
      <section>
        {/* <ActivityList /> */}
        <Calendar />
      </section>
    </>
  );
};

export default Activities;
