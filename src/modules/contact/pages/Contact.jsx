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
  HistoryTabs,
  ActivitiesTabs,
  ActivityHandler,
  NoteHandler,
  FileHandler,
  EmailHandler,
} from "@/modules/deal";

import { Box, Tab, Tabs } from "@mui/material";

import { useLazyGetActivitiesQuery } from "@/redux/services/activityApi";
import { useGetDealsQuery } from "@/redux/services/dealApi";
import { useGetMeQuery } from "@/redux/services/userApi";

import { Model } from "@/modules/common";
import { CreateDealModel, DealCard } from "@/modules/deal";
import { useLazyGetNotesQuery } from "@/redux/services/noteApi";
import { useLazyGetFilesQuery } from "@/redux/services/fileApi";

const Contact = () => {
  const params = useParams();
  const { id } = params;
  const { data: loggedUser } = useGetMeQuery();

  const [isCreateDealModelOpen, setIsCreateDealModeOpen] = useState(false);

  const {
    data: deals,
    isLoading: isDealsLoading,
    isFetching: isDealsFetching,
  } = useGetDealsQuery({
    filters: JSON.stringify([{ id: "contacts", value: { $in: [id] } }]),
    data: true,
    select: "_id",
  });

  const { data, isLoading, isSuccess, isFetching } = useGetContactQuery(id);

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(1);
  function handleTabChange(event, newTab) {
    setCurrentTab(newTab);
  }

  const [deleteContact, { isSuccess: isDeleteSuccess }] =
    useDeleteContactMutation();

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
      </Suspense>
      {!isLoading && !isFetching && isSuccess ? (
        <header className="h-full">
          <div className="px-5 py-3 h-[60px] border-b flex justify-between items-center">
            {loggedUser?.role === "admin" && (
              <button
                onClick={() => setIsCreateDealModeOpen(true)}
                className="btn-filled btn-small"
              >
                <Icon icon="uil:plus" className="text-lg" />
                Deal
              </button>
            )}
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon={"uil:user"} className="text-3xl" />{" "}
              <span>{data.contactPerson}</span>
            </h1>
            {loggedUser?.role === "admin" && (
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteContact}
                  className="btn-filled bg-red-600 border-red-600 btn-small"
                >
                  Delete
                </button>
                <button className="btn-filled btn-small">Update</button>
              </div>
            )}
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
                      return <DealCard dealId={deal._id} key={deal._id} />;
                    })
                  ) : (
                    <p>No Deals to show</p>
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
                          <NoteHandler
                            contacts={[
                              { label: data.contactPerson, value: id },
                            ]}
                            // deals={selectedDeals}
                          />
                        )}
                        {currentTab === 2 && (
                          <ActivityHandler
                            contacts={[
                              { label: data.contactPerson, value: id },
                            ]}
                            // deals={selectedDeals}
                          />
                        )}
                        {currentTab === 3 && (
                          <FileHandler
                            // deals={selectedDeals}
                            contacts={[
                              { label: data.contactPerson, value: id },
                            ]}
                            contactId={id}
                            getByContactsId
                          />
                        )}
                        {currentTab === 4 && (
                          <EmailHandler
                            contacts={[
                              { label: data.contactPerson, value: id },
                            ]}
                            // deals={selectedDeals}
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </Suspense>
                <ActivitiesTabs contactId={id} />
                <HistoryTabsContainer contactId={id} />
              </div>
            </div>
          </div>
        </header>
      ) : (
        <section className="w-full h-screen flex items-center justify-center">
          <Loader />
        </section>
      )}
    </Suspense>
  );
};

const HistoryTabsContainer = ({ contactId }) => {
  const [loading, setLoading] = useState(false);

  const [getActivities, { data: activities }] = useLazyGetActivitiesQuery();
  const [getNotes, { data: notes }] = useLazyGetNotesQuery();
  const [getFiles, { data: files }] = useLazyGetFilesQuery();

  useEffect(() => {
    let isMounted = true;
    const fetchHistories = async () => {
      setLoading(true);
      await getNotes({
        filters: JSON.stringify([
          { id: "contacts", value: { $in: [contactId] } },
        ]),
        data: true,
        populate: "creator deals contacts",
      });
      await getActivities({
        filters: JSON.stringify([
          { id: "contacts", value: { $in: [contactId] } },
          { id: "completed_on", value: { $not: { $eq: null } } },
        ]),
        data: true,
        populate: "performer deals contacts",
      });
      await getFiles({
        filters: JSON.stringify([
          { id: "contactId", value: { $in: [contactId] } },
        ]),
        data: true,
        populate: "uploader",
      });
      setLoading(false);
    };
    isMounted && fetchHistories();
    return () => (isMounted = false);
  }, [contactId]);

  return (
    !loading && (
      <HistoryTabs activities={activities} files={files} notes={notes} />
    )
  );
};

export default Contact;
