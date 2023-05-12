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
  EventTabsContainer,
  ActivitiesTabs,
  ActivityHandler,
  NoteHandler,
  FileHandler,
  EmailHandler,
} from "@/modules/deal";

import { useLazyGetContactsQuery } from "@/redux/services/contactApi";
import { useVerifyPipelineUserQuery } from "@/redux/services/pipelineApi";

const Deal = () => {
  const params = useParams();
  const { id } = params;
  const {
    data = {},
    isLoading,
    isFetching,
    isSuccess,
  } = useGetDealQuery({ id });
  const [
    getContactsByDealId,
    { data: contacts, isSuccess: isContactsSuccess },
  ] = useLazyGetContactsQuery(id);
  const [updateDeal, { isLoading: isDealUpdating }] = useUpdateDealMutation();
  const [deleteDeal, { isLoading: isDealDeleting }] = useDeleteDealMutation();

  const { data: checkedUser = { viewOnly: true } } = useVerifyPipelineUserQuery(
    data.pipelineId
  );

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
    const fetchContacts = async () =>
      await getContactsByDealId({
        filters: JSON.stringify([{ id: "_id", value: { $in: data.contacts } }]),
        data: true,
      });
    if (data?.contacts?.length) {
      fetchContacts();
    }
  }, [data?.contacts]);

  return !isLoading && !isFetching && isSuccess && isContactsSuccess ? (
    <>
      <Header title={"Deal"} />
      <header className="header border-b border-collapse px-5 py-3 h-[120px]/">
        <div className="flex items-center justify-between mb-3">
          <div>
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
              contacts={contacts}
              deal={data}
              dealId={id}
              pipelineId={id}
            />
          )}
          <ActivitiesTabs cardId={id} />
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

const TabsContainer = ({ deal, dealId, contacts = [], pipelineId }) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [filteredContacts, setFilteredContacts] = useState([]);

  function handleTabChange(event, newTab) {
    setCurrentTab(newTab);
  }

  useEffect(() => {
    if (contacts.length) {
      const mapedContacts = contacts.map((contact) => ({
        label: contact.contactPerson,
        value: contact._id,
      }));
      setFilteredContacts(mapedContacts);
    }
  }, [contacts]);
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
              cards={[{ value: dealId, label: deal?.title }]}
              contacts={filteredContacts}
              pipelineId={pipelineId}
            />
          )}
          {currentTab === 2 && (
            <ActivityHandler
              cards={[{ value: dealId, label: deal?.title }]}
              contacts={filteredContacts}
              pipelineId={pipelineId}
            />
          )}
          {currentTab === 3 && (
            <FileHandler
              cards={[{ value: dealId, label: deal?.title }]}
              contacts={filteredContacts}
              pipelineId={pipelineId}
            />
          )}
          {currentTab === 4 && (
            <EmailHandler
              cards={[{ value: dealId, label: deal?.title }]}
              contacts={filteredContacts}
              pipelineId={pipelineId}
            />
          )}
        </Box>
      </Suspense>
    </Suspense>
  );
};

export default Deal;
