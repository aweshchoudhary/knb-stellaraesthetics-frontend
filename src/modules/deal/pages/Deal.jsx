import React, { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";

import {
  useDeleteDealMutation,
  useGetDealQuery,
  useUpdateDealMutation,
} from "@/redux/services/dealApi";

import { Header, Loader } from "@/modules/common";
import { DealSideBar } from "@/modules/deal";

import {
  HistoryTabs,
  ActivitiesTabs,
  ActivityHandler,
  NoteHandler,
  FileHandler,
  EmailHandler,
} from "@/modules/deal";

import { useLazyVerifyPipelineUserQuery } from "@/redux/services/pipelineApi";
import { Icon } from "@iconify/react";
import { useLazyGetActivitiesQuery } from "@/redux/services/activityApi";
import { useLazyGetNotesQuery } from "@/redux/services/noteApi";
import { useLazyGetFilesQuery } from "@/redux/services/fileApi";

const Deal = () => {
  const params = useParams();
  const { id } = params;
  const {
    data = {},
    isLoading,
    isFetching,
    isSuccess,
  } = useGetDealQuery({ id, params: { populate: "contacts" } });

  const [updateDeal, { isLoading: isDealUpdating }] = useUpdateDealMutation();
  const [deleteDeal, { isLoading: isDealDeleting }] = useDeleteDealMutation();

  const [verifyPipelineUser, { data: checkedUser = { viewOnly: true } }] =
    useLazyVerifyPipelineUserQuery();

  const navigate = useNavigate();
  async function handleDeleteDeal() {
    await deleteDeal(id);
    navigate(-1);
  }

  async function handleUpdateDealStatus(status) {
    await updateDeal({ id, update: { status } });
    navigate(-1);
  }

  useEffect(() => {
    if (data.pipelineId) verifyPipelineUser(data.pipelineId);
  }, [data]);

  return !isLoading && !isFetching && isSuccess ? (
    <>
      <Header title={"Deal"} />
      <header className="header border-b border-collapse px-5 py-3 h-[120px]/">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="text-4xl hover:text-primary"
            >
              <Icon icon="uil:arrow-left" />
            </button>
            <h1 className="text-2xl font-semibold">{data.title}</h1>
          </div>
          {!checkedUser.viewOnly && (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <button
                  disabled={isDealUpdating}
                  onClick={() => handleUpdateDealStatus("won")}
                  className="btn-filled bg-green-600 border-0"
                >
                  Won
                </button>
                <button
                  disabled={isDealUpdating}
                  onClick={() => handleUpdateDealStatus("lost")}
                  className="btn-filled bg-red-600 border-0"
                >
                  Lost
                </button>
                <button
                  className="btn-outlined text-red-600 ml-2"
                  onClick={handleDeleteDeal}
                >
                  {isDealDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <section className="flex min-h-[calc(100%-60px)] items-stretch">
        <DealSideBar data={data} />
        <div className="flex-1 p-5 bg-paper">
          {!checkedUser.viewOnly && (
            <TabsContainer
              contacts={data.contacts}
              deal={data}
              dealId={id}
              pipelineId={id}
            />
          )}
          <ActivitiesTabs dealId={data._id} />
          <HistoryTabsContainer dealId={data._id} />
        </div>
      </section>
    </>
  ) : (
    <section className="h-screen w-full flex items-center justify-center">
      <Loader />
    </section>
  );
};

const TabsContainer = ({ deal, dealId, contacts = [], pipelineId }) => {
  const [currentTab, setCurrentTab] = useState(1);

  function handleTabChange(event, newTab) {
    setCurrentTab(newTab);
  }
  return (
    <Suspense>
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
      <Suspense>
        <Box className="bg-bg">
          {currentTab === 1 && (
            <NoteHandler
              deals={[{ value: dealId, label: deal?.title }]}
              contacts={contacts.map((contact) => ({
                label: contact.contactPerson,
                value: contact._id,
              }))}
              pipelineId={pipelineId}
              dealId={dealId}
            />
          )}
          {currentTab === 2 && (
            <ActivityHandler
              deals={[{ value: dealId, label: deal?.title }]}
              contacts={contacts.map((contact) => ({
                label: contact.contactPerson,
                value: contact._id,
              }))}
              pipelineId={pipelineId}
              dealId={dealId}
            />
          )}
          {currentTab === 3 && (
            <FileHandler
              deals={[{ value: dealId, label: deal?.title }]}
              contacts={contacts.map((contact) => ({
                label: contact.contactPerson,
                value: contact._id,
              }))}
              pipelineId={pipelineId}
              dealId={dealId}
              getByDealsId
            />
          )}
          {currentTab === 4 && (
            <EmailHandler
              deals={[{ value: dealId, label: deal?.title }]}
              contacts={contacts.map((contact) => ({
                label: contact.contactPerson,
                value: contact._id,
              }))}
              pipelineId={pipelineId}
            />
          )}
        </Box>
      </Suspense>
    </Suspense>
  );
};

const HistoryTabsContainer = ({ dealId }) => {
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [getActivities] = useLazyGetActivitiesQuery();
  const [getNotes] = useLazyGetNotesQuery();
  const [getFiles] = useLazyGetFilesQuery();

  useEffect(() => {
    let isMounted = true;
    const fetchHistories = async () => {
      setLoading(true);
      const noteData = await getNotes({
        filters: JSON.stringify([{ id: "deals", value: { $in: [dealId] } }]),
        data: true,
        populate: "creator",
      });
      noteData.data.length !== 0 && setNotes(noteData.data);

      const activityData = await getActivities({
        filters: JSON.stringify([{ id: "deals", value: { $in: [dealId] } }]),
        data: true,
        populate: "performer",
      });
      activityData.data.length !== 0 && setActivities(activityData.data);
      const fileData = await getFiles({
        filters: JSON.stringify([{ id: "dealId", value: { $in: [dealId] } }]),
        data: true,
        populate: "uploader",
      });
      fileData.data.length !== 0 && setFiles(fileData.data);
      setLoading(false);
    };
    isMounted && fetchHistories();
    return () => (isMounted = false);
  }, [dealId]);

  return (
    !loading && (
      <HistoryTabs activities={activities} files={files} notes={notes} />
    )
  );
};

export default Deal;
