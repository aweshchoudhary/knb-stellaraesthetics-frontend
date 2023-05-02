import { Icon } from "@iconify/react";
import moment from "moment";
import React, { useState } from "react";
import Loader from "../global/Loader";
import { toast } from "react-toastify";
import {
  useGetNotesQuery,
  useDeleteNoteMutation,
} from "../../services/noteApi";

const EventTabsContainer = ({ cardId }) => {
  const [activeTab, setActiveTab] = useState("notes");
  const tabs = ["notes"];
  return (
    <div className="my-5">
      <h2 className="mb-2 text-lg font-medium">History</h2>
      <div className="tabs flex items-center gap-2">
        {tabs.map((item, index) => (
          <button
            className={`capitalize py-1 px-4 rounded transition ${
              activeTab === item ? "bg-bg" : "hover:bg-bg"
            }`}
            onClick={() => setActiveTab(item)}
            key={index}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="body my-4">
        <Activites name={activeTab} cardId={cardId} />
      </div>
    </div>
  );
};
const Activites = ({ name, cardId }) => {
  return (
    <div>
      <ul>{name === "notes" ? <Note cardId={cardId} /> : null}</ul>
    </div>
  );
};
const Note = ({ dealId }) => {
  const { data, isLoading, isSuccess, isFetching } = useGetNotesQuery({
    dataFilters: { dealId },
    data: true,
  });
  const [deleteNote] = useDeleteNoteMutation();

  async function handlDeleteDeal(id) {
    await deleteNote(id);
    toast.success("Note deleted successfully");
  }
  return !isLoading && !isFetching && isSuccess ? (
    data?.data?.length ? (
      <>
        {data.data.map((note, index) => {
          return (
            <li className="flex" key={index}>
              <div className="w-[60px] flex flex-col items-center">
                <span className="w-[40px] h-[40px] rounded-full bg-bg flex items-center justify-center">
                  <Icon icon={"material-symbols:sticky-note-2-outline"} />
                </span>
                <div className="line border-l-2 flex-1"></div>
              </div>
              <div className="bg-bg mb-2 p-3 text-sm flex-1">
                <header className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span>{moment(note.createdAt).fromNow()}</span>
                    <span>Awesh Choudhary</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="btn-outlined btn-small">
                      <Icon icon={"uil:pen"} />
                    </button>
                    <button
                      onClick={() => handlDeleteDeal(note._id)}
                      className="btn-outlined btn-small"
                    >
                      <Icon icon={"uil:trash"} />
                    </button>
                  </div>
                </header>
                <div
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: note.body }}
                ></div>
              </div>
            </li>
          );
        })}
        <li className="flex">
          <div className="w-[60px] flex flex-col items-center">
            <span className="w-[40px] h-[40px] rounded-full bg-bg flex items-center justify-center">
              <Icon icon={"uil:plus"} />
            </span>
            {/* <div className="line border-l-2 flex-1"></div> */}
          </div>
          <div className="p-3 pt-0 text-sm flex-1">
            <h3 className="font-medium mb-2">Deal Created</h3>
            <p className="flex gap-4">
              <span>{moment(data.createdAt).fromNow()}</span>
              <span>{moment(data.createdAt).format("DD-MM-YYYY")}</span>
              <span>Awesh Choudhary</span>
            </p>
          </div>
        </li>
      </>
    ) : (
      <section className="w-full h-[100px] bg-bg my-4 flex items-center justify-center">
        <p>No notes to show</p>
      </section>
    )
  ) : (
    <section className="w-full h-[100px] bg-bg my-4 flex items-center justify-center">
      <Loader />
    </section>
  );
};

export default EventTabsContainer;
