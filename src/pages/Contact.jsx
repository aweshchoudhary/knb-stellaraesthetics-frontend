import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteClientMutation,
  useGetClientQuery,
  useUpdateClientMutation,
} from "../services/clientApi";
import Header from "../components/global/Header";
import Loader from "../components/global/Loader";
import { Icon } from "@iconify/react";
import Email from "../components/tabs/Email";
import File from "../components/tabs/File";
import EventHandler from "../components/tabs/EventHandler";
import Notes from "../components/tabs/Notes";
import Tabs from "../components/global/Tabs";
import FocusActivitiesTabs from "../components/tabs/FocusActivitiesTabs";
import ActivitiesTabs from "../components/tabs/ActivitiesTabs";
import { useState } from "react";

const Contact = () => {
  const params = useParams();
  const { id } = params;
  const { data, isLoading, isSuccess, isFetching } = useGetClientQuery(id);
  const [updateData, setUpdateData] = useState({});
  const navigate = useNavigate();

  const [deleteClient] = useDeleteClientMutation();
  const [updateClient] = useUpdateClientMutation();

  const tabs = [
    {
      id: 1,
      name: "notes",
      icon: "material-symbols:sticky-note-2-outline",
      component: <Notes cardId={id} />,
    },
    {
      id: 2,
      name: "activity",
      icon: "material-symbols:calendar-month-outline",
      component: <EventHandler cardId={id} />,
    },
    {
      id: 3,
      name: "File",
      icon: "material-symbols:attach-file",
      component: <File />,
    },
    {
      id: 4,
      name: "Email",
      icon: "uil:envelope",
      component: <Email />,
    },
  ];

  async function handleUpdateClient() {
    await updateClient({ id, update: updateData });
  }

  async function handleDeleteClient() {
    await deleteClient(id);
    navigate("/", { replace: true });
  }

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
                  <p>Address: Not Specified</p>
                </div>
              </div>
              <div className="flex-1 border-r">
                <header className="py-3 px-5 bg-primary text-white border-b">
                  <h2>Open Deals</h2>
                </header>
                <div className="p-5 flex flex-col gap-2">
                  <div className="w-full py-3 px-4 border flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <span className="w-[30px] h-[30px] rounded-full bg-gray-500"></span>
                      <h2>Deal 1</h2>
                    </div>
                    <div>10,000Rs</div>
                  </div>
                  <div className="w-full py-3 px-4 border flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <span className="w-[30px] h-[30px] rounded-full bg-gray-500"></span>
                      <h2>Deal 1</h2>
                    </div>
                    <div>10,000Rs</div>
                  </div>
                  <div className="w-full py-3 px-4 border flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <span className="w-[30px] h-[30px] rounded-full bg-gray-500"></span>
                      <h2>Deal 1</h2>
                    </div>
                    <div>10,000Rs</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 border-r">
                <header className="py-3 px-5 bg-primary text-white border-b">
                  <h2>Next Activities</h2>
                </header>
                <div className="p-5 flex flex-col gap-3">
                  <div className="w-full py-3 px-4 border flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <Icon icon="uil:phone" className="text-xl" />
                      <h2>Call For Details</h2>
                    </div>
                    <div>20 April 2023</div>
                  </div>
                  <div className="w-full py-3 px-4 border flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <Icon icon="uil:envelope" className="text-xl" />
                      <h2>Email For Reminder</h2>
                    </div>
                    <div>24 April 2023</div>
                  </div>
                  <div className="w-full py-3 px-4 border flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <Icon icon="uil:envelope" className="text-xl" />
                      <h2>Email For Reminder</h2>
                    </div>
                    <div>24 April 2023</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-1">
              <div className="flex-1 p-5 bg-paper">
                <Tabs tabs={tabs} />
                <FocusActivitiesTabs cardId={id} />
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
