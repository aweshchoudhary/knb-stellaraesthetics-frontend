import Header from "../components/global/Header";
// import Tabs from "../components/global/Tabs";
import DealSideBar from "../components/deal/DealSideBar";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteCardMutation,
  useGetCardQuery,
  useUpdateCardMutation,
} from "../services/dealApi";
import Loader from "../components/global/Loader";

import EventTabsContainer from "../components/eventHandlers/EventTabsContainer";
import FocusActivitiesTabs from "../components/eventHandlers/ActivitiesTabs";

import ActivityHandler from "../components/eventHandlers/ActivityHandler";
import NoteHandler from "../components/eventHandlers/NoteHandler";
import FileHandler from "../components/eventHandlers/FileHandler";
import EmailHandler from "../components/eventHandlers/EmailHandler";
import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

const Deal = () => {
  const params = useParams();
  const { id } = params;
  const { data, isLoading, isFetching, isSuccess } = useGetCardQuery(id);
  const [updateCard, { isLoading: isCardUpdating }] = useUpdateCardMutation();
  const [deleteCard, { isLoading: isCardDeleting }] = useDeleteCardMutation();

  const navigate = useNavigate();

  async function handleDeleteCard() {
    await deleteCard(id);
    navigate("/pipeline");
  }

  async function handleUpdateCardStatus(status) {
    await updateCard({ id, update: { status } });
    navigate("/pipeline");
  }

  const [currentTab, setCurrentTab] = useState(1);

  function handleTabChange(event, newTab) {
    setCurrentTab(newTab);
    navigate("/pipeline");
  }

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
              <button
                disabled={isCardUpdating}
                onClick={() => handleUpdateCardStatus("won")}
                className="btn-filled bg-green-600 border-0"
              >
                Won
              </button>
              <button
                disabled={isCardUpdating}
                onClick={() => handleUpdateCardStatus("lost")}
                className="btn-filled bg-red-600 border-0"
              >
                Lost
              </button>
              <button
                className="btn-outlined text-red-600 ml-2"
                onClick={handleDeleteCard}
              >
                {isCardDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="flex min-h-[calc(100%-180px)] items-stretch">
        <DealSideBar data={data} />
        <div className="flex-1 p-5 bg-paper">
          <Box>
            <Box className="bg-bg border-b">
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="primary tabs example"
              >
                <Tab value={1} label="Note" />
                <Tab value={2} label="Activity" />
                <Tab value={3} label="File" />
                <Tab value={4} label="Email" />
              </Tabs>
            </Box>
            <Box className="bg-bg">
              {currentTab === 1 && (
                <NoteHandler cards={[{ value: id, label: data?.title }]} />
              )}
              {currentTab === 2 && (
                <ActivityHandler cards={[{ value: id, label: data?.title }]} />
              )}
              {currentTab === 3 && (
                <FileHandler cards={[{ value: id, label: data?.title }]} />
              )}
              {currentTab === 4 && (
                <EmailHandler cards={[{ value: id, label: data?.title }]} />
              )}
            </Box>
          </Box>
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
