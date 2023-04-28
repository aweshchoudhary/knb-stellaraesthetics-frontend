import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteClientMutation,
  useGetClientQuery,
} from "../services/clientApi";
import Header from "../components/global/Header";
import Loader from "../components/global/Loader";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import ActivityHandler from "../components/eventHandlers/ActivityHandler";
import NoteHandler from "../components/eventHandlers/NoteHandler";
import FileHandler from "../components/eventHandlers/FileHandler";
import EmailHandler from "../components/eventHandlers/EmailHandler";
import { useGetActivitiesByClientIdQuery } from "../services/activityApi";
import moment from "moment";
import { useGetCardsByClientIdQuery } from "../services/dealApi";
import Card from "../components/global/Card";
import { Box, Tab, Tabs } from "@mui/material";

import Model from "../components/models/Model";
import CreateDealModel from "../components/models/createDealModel/CreateDealModel";

const Contact = () => {
  const params = useParams();
  const { id } = params;

  const [isCreateDealModelOpen, setIsCreateDealModeOpen] = useState(false);

  const {
    data: activities,
    // isLoading: isActivitiesLoading,
    // isFetching: isActivitiesFetching,
  } = useGetActivitiesByClientIdQuery(id);
  const {
    data: cards,
    // isLoading: isCardsLoading,
    // isFetching: isCardsFetching,
  } = useGetCardsByClientIdQuery(id);

  const { data, isLoading, isSuccess, isFetching } = useGetClientQuery(id);

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(1);
  function handleTabChange(event, newTab) {
    setCurrentTab(newTab);
  }

  const [deleteClient, { isSuccess: isDeleteSuccess }] =
    useDeleteClientMutation();

  const selectedCards =
    cards?.map((i) => ({
      label: i.title,
      value: i._id,
    })) || [];

  async function handleDeleteClient() {
    await deleteClient(id);
    navigate("/contacts", { replace: true });
  }
  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Contact Deleted Successfully");
    }
  }, [isDeleteSuccess]);
  return (
    <>
      <Header title={"Contact"} />
      <Model setIsOpen={setIsCreateDealModeOpen} isOpen={isCreateDealModelOpen}>
        <CreateDealModel
          selectedData={
            data ? [{ label: data.contactPerson, value: data._id }] : []
          }
          setIsOpen={setIsCreateDealModeOpen}
        />
      </Model>
      {!isLoading && !isFetching && isSuccess ? (
        <>
          <section className="px-5 py-3 border-b flex justify-between items-center">
            <button
              onClick={() => setIsCreateDealModeOpen(true)}
              className="btn-filled btn-small"
            >
              <Icon icon="uil:plus" className="text-lg" />
              Deal
            </button>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon={"uil:user"} className="text-3xl" />{" "}
              <span>{data.contactPerson}</span>
            </h1>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteClient}
                className="btn-filled bg-red-600 border-red-600 btn-small"
              >
                Delete
              </button>
              <button className="btn-filled btn-small">Update</button>
            </div>
          </section>
          <section className="flex w-full border-b">
            <div className="w-[350px] shrink-0">
              <div className="flex-1 border-r">
                <header className="py-3 px-5 bg-primary text-white border-b">
                  <h2>Personal Details</h2>
                </header>
                <div className="p-5 flex flex-col gap-4">
                  <p className="flex gap-2 items-center">
                    <span className="text-2xl">
                      <Icon icon={"uil:user"} />
                    </span>
                    <span>{data.contactPerson}</span>
                  </p>
                  <p className="flex gap-2 items-center">
                    <span className="text-2xl">
                      <Icon icon={"uil:phone"} />
                    </span>
                    <span>{data.mobile || "Not Specified"}</span>
                  </p>
                  <p className="flex gap-2 items-center">
                    <span className="text-2xl">
                      <Icon icon="uil:whatsapp" />
                    </span>
                    <span>{data.whatsapp || "Not Specified"}</span>
                  </p>
                  <p className="flex gap-2 items-center">
                    <span className="text-2xl">
                      <Icon icon="uil:envelope" />
                    </span>
                    <span>{data.email || "Not Specified"}</span>
                  </p>
                  <p className="flex gap-2 items-center">
                    <span className="text-2xl">
                      <Icon icon="material-symbols:location-on-outline" />
                    </span>
                    <span>
                      {data?.address?.city?.name}, {data?.address?.state?.name},{" "}
                      {data?.address?.country?.name}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex-1 border-r">
                <header className="py-3 px-5 bg-primary text-white border-b">
                  <h2>Open Deals</h2>
                </header>
                <div className="p-5 flex flex-col gap-2">
                  {cards?.length !== 0 &&
                    cards?.map((card) => {
                      return <Card card={card} />;
                    })}
                </div>
              </div>
              <div className="flex-1 border-r">
                <header className="py-3 px-5 bg-primary text-white border-b">
                  <h2>Next Activities</h2>
                </header>
                <div className="p-5 flex flex-col gap-3">
                  {activities?.length !== 0 &&
                    activities?.map((activity) => {
                      return (
                        <div className="w-full py-3 px-4 border flex justify-between items-center">
                          <div className="flex gap-3 items-center">
                            <Icon icon={activity?.icon} className="text-xl" />
                            <h2>{activity.title}</h2>
                          </div>
                          <div>
                            {moment(activity.startDateTime).format(
                              "DD-MM-YYYY"
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="flex flex-1">
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
                    {currentTab === 1 && <NoteHandler cards={selectedCards} />}
                    {currentTab === 2 && (
                      <ActivityHandler cards={selectedCards} />
                    )}
                    {currentTab === 3 && <FileHandler cards={selectedCards} />}
                    {currentTab === 4 && <EmailHandler cards={selectedCards} />}
                  </Box>
                </Box>
                {/* <EventTabsContainer cardId={id} />
                <ActivitiesTabs cardId={id} /> */}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="w-full h-screen flex items-center justify-center">
          <Loader />
        </section>
      )}
    </>
  );
};

export default Contact;
