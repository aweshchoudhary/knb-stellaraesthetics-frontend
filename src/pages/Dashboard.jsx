import LineDashboard from "../components/dashboard/LineDashboard";
import CountDashboard from "../components/dashboard/CountDashboard";
import Header from "../components/global/Header";
import BarDashboard from "../components/dashboard/BarDashboard";
import AreaDashboard from "../components/dashboard/AreaDashboard";
import RadarDashboard from "../components/dashboard/RadarDashboard";

const Dashboard = () => {
  return (
    <>
      <Header title="Dashboard" />
      <section className="p-5 flex gap-2">
        <div className="border flex-1 p-5">
          <CountDashboard title={"Total Pipelines"} count={50} />
        </div>
        <div className="border flex-1 p-5">
          <CountDashboard title={"Total Deals"} count={150} />
        </div>
        <div className="border flex-1 p-5">
          <CountDashboard title={"Total Activities"} count={450} />
        </div>
      </section>
      <section className="p-5 min-h-[350px] flex gap-2">
        <div className="border flex-1 p-5 bg-bg">
          <LineDashboard title={"Total Pipelines"} count={50} />
        </div>
        <div className="border flex-1 p-5 bg-bg">
          <BarDashboard title={"Total Deals"} count={150} />
        </div>
      </section>
      <section className="p-5 min-h-[350px] flex gap-2">
        <div className="border flex-1 p-5 bg-bg">
          <AreaDashboard title={"Total Pipelines"} count={50} />
        </div>
        <div className="border flex-1 p-5 bg-bg">
          <RadarDashboard title={"Total Pipelines"} count={50} />
        </div>
      </section>
    </>
  );
};

export default Dashboard;
