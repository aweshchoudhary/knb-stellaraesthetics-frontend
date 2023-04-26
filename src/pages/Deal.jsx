import Header from "../components/global/Header";
import Tabs from "../components/global/Tabs";
import DealSideBar from "../components/deal/DealSideBar";
import { useParams } from "react-router-dom";
import { useGetCardQuery } from "../services/dealApi";
import Loader from "../components/global/Loader";

import EventTabsContainer from "../components/eventHandlers/EventTabsContainer";
import FocusActivitiesTabs from "../components/eventHandlers/ActivitiesTabs";

import ActivityHandler from "../components/eventHandlers/ActivityHandler";
import NoteHandler from "../components/eventHandlers/NoteHandler";
import FileHandler from "../components/eventHandlers/FileHandler";
import EmailHandler from "../components/eventHandlers/EmailHandler";

const Deal = () => {
  const params = useParams();
  const { id } = params;
  const { data, isLoading, isFetching, isSuccess } = useGetCardQuery(id);

  const tabs = [
    {
      id: 1,
      name: "notes",
      icon: "material-symbols:sticky-note-2-outline",
      component: <NoteHandler card={{ value: id, label: data?.title }} />,
    },
    {
      id: 2,
      name: "activity",
      icon: "material-symbols:calendar-month-outline",
      component: (
        <ActivityHandler
          dealData={data}
          card={{ value: id, label: data?.title }}
        />
      ),
    },
    {
      id: 3,
      name: "File",
      icon: "material-symbols:attach-file",
      component: <FileHandler card={{ value: id, label: data?.title }} />,
    },
    {
      id: 4,
      name: "Email",
      icon: "uil:envelope",
      component: <EmailHandler card={{ value: id, label: data?.title }} />,
    },
  ];

  return !isLoading && !isFetching && isSuccess ? (
    <>
      <Header title={"Deal"} />
      <section className="header border-b border-collapse px-5 py-3 h-[120px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-semibold">{data.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <button className="btn-filled bg-green-600 border-0">Won</button>
              <button className="btn-filled bg-red-600 border-0">Lost</button>
              <button
                className="btn-outlined text-red-600 ml-2"
                // onClick={handleDeleteDeal}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        {/* <div className="w-full flex gap-1">
          {stages.data &&
            stages.data.map((stage, index) => {
              return (
                <button
                  key={index}
                  className={`px-2 py-1 flex-1 text-center ${
                    data.stages[index]?.active
                      ? "text-white bg-primary"
                      : "bg-paper hover:bg-primary hover:text-white"
                  }`}
                  onClick={() =>
                    updateDealStageFn(
                      data._id,
                      data.stages[index].active ? data.stages[index] : null._id,
                      stage._id
                    )
                  }
                >
                  <p>
                    {stage.name}:{" "}
                    {data?.stages[index]?.active
                      ? moment(data?.stages[index]?.createdAt).fromNow()
                      : "0 Days"}
                  </p>
                </button>
              );
            })}
        </div> */}
      </section>
      <section className="flex min-h-[calc(100%-180px)] items-stretch">
        <DealSideBar data={data} />
        <div className="flex-1 p-5 bg-paper">
          <Tabs tabs={tabs} />
          <FocusActivitiesTabs cardId={id} />
          <EventTabsContainer cardId={id} />
        </div>
      </section>
    </>
  ) : (
    <section className="h-screen w-full flex items-center justify-center">
      <Loader />
    </section>
  );
};

export default Deal;
