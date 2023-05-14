import React, { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteContactMutation,
  useGetContactQuery,
} from "@/redux/services/contactApi";
import { Header, Loader } from "@/modules/common";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

import {
  EventTabsContainer,
  ActivitiesTabs,
  ActivityHandler,
  NoteHandler,
  FileHandler,
  EmailHandler,
  ActivityDisplayModel,
} from "@/modules/deal";

import moment from "moment";
import { Box, Tab, Tabs, Typography } from "@mui/material";

import { useGetActivitiesQuery } from "@/redux/services/activityApi";
import { useGetDealsQuery } from "@/redux/services/dealApi";
import { useGetMeQuery } from "@/redux/services/userApi";

import { Model } from "@/modules/common";
import { CreateDealModel, DealCard } from "@/modules/deal";

const Contact = () => {
  const params = useParams();
  const { id } = params;
  const { data: loggedUser } = useGetMeQuery();

  const [isCreateDealModelOpen, setIsCreateDealModeOpen] = useState(false);
  const [isActivityDisplayModelOpen, setIsActivityDisplayModelOpen] =
    useState(false);
  const [currentActivity, setCurrentActivity] = useState({});

  const {
    data: activities,
    // isLoading: isActivitiesLoading,
    // isFetching: isActivitiesFetching,
  } = useGetActivitiesQuery({
    filters: JSON.stringify([{ id: "contacts", value: id }]),
    data: true,
  });
  const {
    data: deals,
    isLoading: isDealsLoading,
    isFetching: isDealsFetching,
  } = useGetDealsQuery({
    filters: JSON.stringify([{ id: "contacts", value: { $in: [id] } }]),
    data: true,
    populate: "label contacts",
    sorting: JSON.stringify([{ id: "createdAt", desc: false }]),
  });

  const { data, isLoading, isSuccess, isFetching } = useGetContactQuery(id);

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(1);
  function handleTabChange(event, newTab) {
    setCurrentTab(newTab);
  }

  const [deleteContact, { isSuccess: isDeleteSuccess }] =
    useDeleteContactMutation();

  const selectedDeals =
    deals?.data?.map((i) => ({
      label: i.title,
      value: i._id,
    })) || [];

  async function handleDeleteContact() {
    await deleteContact(id);
    navigate("/contacts", { replace: true });
  }
  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Contact Deleted Successfully");
    }
  }, [isDeleteSuccess]);
  return (
    <Suspense>
      <Header title={"Contact"} />
      <Suspense>
        {isCreateDealModelOpen && (
          <Model
            setIsOpen={setIsCreateDealModeOpen}
            isOpen={isCreateDealModelOpen}
          >
            <CreateDealModel
              selectedData={
                data ? [{ label: data.contactPerson, value: data._id }] : []
              }
              setIsOpen={setIsCreateDealModeOpen}
            />
          </Model>
        )}
        <Model
          title="Activity"
          isOpen={isActivityDisplayModelOpen}
          setIsOpen={setIsActivityDisplayModelOpen}
        >
          <ActivityDisplayModel
            data={currentActivity}
            setIsOpen={setIsActivityDisplayModelOpen}
          />
        </Model>
      </Suspense>
      {!isLoading && !isFetching && isSuccess ? (
        <section className="h-full">
          <div className="px-5 py-3 h-[60px] border-b flex justify-between items-center">
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
                onClick={handleDeleteContact}
                className="btn-filled bg-red-600 border-red-600 btn-small"
              >
                Delete
              </button>
              <button className="btn-filled btn-small">Update</button>
            </div>
          </div>
          <div className="flex w-full min-h-[calc(100vh-60px)] border-b">
            <div className="w-[350px] shrink-0">
              <div className="flex-1 border-r">
                <header className="py-3 px-5 bg-paper border-b">
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
                  {data.address.city && (
                    <p className="flex gap-2 items-center">
                      <span className="text-2xl">
                        <Icon icon="material-symbols:location-on-outline" />
                      </span>
                      <span>
                        {data?.address?.city?.name},{" "}
                        {data?.address?.state?.name},{" "}
                        {data?.address?.country?.name}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-1 border-r">
                <header className="py-3 px-5 bg-paper border-b">
                  <h2>Open Deals</h2>
                </header>
                <div className="p-5 flex flex-col gap-2">
                  {!isDealsFetching &&
                  !isDealsLoading &&
                  deals?.data?.length ? (
                    deals.data.map((deal) => {
                      return <DealCard deal={deal} key={deal._id} />;
                    })
                  ) : (
                    <p>No Deals to show</p>
                  )}
                </div>
              </div>
              <div className="flex-1 border-r">
                <header className="py-3 px-5 bg-paper border-b">
                  <h2>Next Activities</h2>
                </header>
                <div className="p-5 flex flex-col gap-3">
                  {activities?.length !== 0 ? (
                    activities?.map((activity, index) => {
                      return (
                        <>
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentActivity(activity);
                              setIsActivityDisplayModelOpen(true);
                            }}
                            className="w-full p-2 text-left border flex justify-between items-center text-sm"
                          >
                            <div className="flex flex-1 gap-2 items-center">
                              <Icon
                                icon={"mdi:calendar-task"}
                                className="text-xl"
                              />
                              <Typography noWrap className="w-[100px] text-xs">
                                {activity.title}
                              </Typography>
                            </div>
                            <div className="shrink-0">
                              {moment(activity.startDateTime).format(
                                "Do MMMM YYYY"
                              )}
                            </div>
                          </button>
                        </>
                      );
                    })
                  ) : (
                    <p>No activites to show</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-1">
              <div className="flex-1 p-5 bg-paper">
                <Suspense
                  className={
                    <section className="p-5 bg-bg">
                      <Loader />
                    </section>
                  }
                >
                  {loggedUser?.role !== "member" && (
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
                          <NoteHandler deals={selectedDeals} />
                        )}
                        {currentTab === 2 && (
                          <ActivityHandler deals={selectedDeals} />
                        )}
                        {currentTab === 3 && (
                          <FileHandler deals={selectedDeals} />
                        )}
                        {currentTab === 4 && (
                          <EmailHandler deals={selectedDeals} />
                        )}
                      </Box>
                    </Box>
                  )}
                </Suspense>
                <ActivitiesTabs dealId={id} />
                <EventTabsContainer dealId={id} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="w-full h-screen flex items-center justify-center">
          <Loader />
        </section>
      )}
    </Suspense>
  );
};

export default Contact;
