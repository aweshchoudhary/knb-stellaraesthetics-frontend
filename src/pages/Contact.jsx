import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteClientMutation,
  useGetClientQuery,
  useUpdateClientMutation,
} from "../services/clientApi";
import Header from "../components/global/Header";
import Loader from "../components/global/Loader";
import { Icon } from "@iconify/react";
import Tabs from "../components/global/Tabs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import formatNumber from "../components/functions/formatNumber";

import EventTabsContainer from "../components/eventHandlers/EventTabsContainer";
import ActivitiesTabs from "../components/eventHandlers/ActivitiesTabs";

import ActivityHandler from "../components/eventHandlers/ActivityHandler";
import NoteHandler from "../components/eventHandlers/NoteHandler";
import FileHandler from "../components/eventHandlers/FileHandler";
import EmailHandler from "../components/eventHandlers/EmailHandler";
import { useGetActivitiesByClientIdQuery } from "../services/activityApi";
import moment from "moment";
import { useGetCardsByClientIdQuery } from "../services/dealApi";
import Card from "../components/global/Card";

const Contact = () => {
  const params = useParams();
  const { id } = params;
  const {
    data: activities,
    isLoading: isActivitiesLoading,
    isFetching: isActivitiesFetching,
  } = useGetActivitiesByClientIdQuery(id);
  const {
    data: cards,
    isLoading: isCardsLoading,
    isFetching: isCardsFetching,
  } = useGetCardsByClientIdQuery(id);
  const { data, isLoading, isSuccess, isFetching } = useGetClientQuery(id);
  const [updateData, setUpdateData] = useState({});
  const navigate = useNavigate();

  const [deleteClient, { isSuccess: isDeleteSuccess }] =
    useDeleteClientMutation();
  const [updateClient] = useUpdateClientMutation();

  const tabs = [
    {
      id: 1,
      name: "notes",
      icon: "material-symbols:sticky-note-2-outline",
      component: <NoteHandler />,
    },
    {
      id: 2,
      name: "activity",
      icon: "material-symbols:calendar-month-outline",
      component: <ActivityHandler />,
    },
    {
      id: 3,
      name: "File",
      icon: "material-symbols:attach-file",
      component: <FileHandler />,
    },
    {
      id: 4,
      name: "Email",
      icon: "uil:envelope",
      component: <EmailHandler />,
    },
  ];

  async function handleUpdateClient() {
    await updateClient({ id, update: updateData });
  }

  async function handleDeleteClient() {
    await deleteClient(id);
    navigate("/contacts", { replace: true });
  }
  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Contact Deleted Successfully");
    }
  }, [isDeleteSuccess]);
  console.log(activities);
  return (
    <>
      <Header title={"Contact"} />

      {!isLoading && !isFetching && isSuccess ? (
        <>
          <section className="p-5 border-b flex justify-between items-center">
            <h1 className="text-xl font-semibold flex items-center gap-4">
              <Icon icon={"uil:user"} className="text-3xl" />{" "}
              <span>{data.contactPerson}</span>
            </h1>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteClient}
                className="btn-filled bg-red-600 border-red-600"
              >
                Delete
              </button>
              <button className="btn-filled">Update</button>
            </div>
          </section>
          <section className="flex w-full border-b">
            <div className="w-[350px] shrink-0">
              <div className="flex-1 border-r">
                <header className="py-3 px-5 bg-primary text-white border-b">
                  <h2>Personal Details</h2>
                </header>
                <div className="p-5 flex flex-col gap-3">
                  <p>Full Name: {data.contactPerson}</p>
                  <p>Mobile Number: {data.mobile}</p>
                  <p>Whatsapp Number:{data.whatsapp}</p>
                  <p>Email: {data.email}</p>
                  <p>
                    Address: {data?.address?.city?.name},{" "}
                    {data?.address?.state?.name}, {data?.address?.country?.name}
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
                      return (
                        // <Link
                        //   to={"/deals/" + card._id}
                        //   className="text-sm w-full py-3 px-4 border flex justify-between items-center"
                        // >
                        //   <div className="flex gap-2 items-center">
                        //     {/* <span className="w-[20px] h-[20px] rounded-full bg-gray-500"></span> */}
                        //     <h2>{card.title}</h2>
                        //   </div>
                        //   <div>{formatNumber(card.value.value)}</div>
                        // </Link>
                        <Card card={card} />
                      );
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
                <Tabs tabs={tabs} />
                <EventTabsContainer cardId={id} />
                <ActivitiesTabs cardId={id} />
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
