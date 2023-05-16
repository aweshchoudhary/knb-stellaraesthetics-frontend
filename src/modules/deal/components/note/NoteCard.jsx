import { Model } from "@/modules/common";
import { Icon } from "@iconify/react";
import moment from "moment";
import React, { Suspense, useState } from "react";
import NoteDisplayModel from "./NoteDisplayModel";

const NoteCard = ({ note }) => {
  const [isDisplayModelOpen, setIsDisplayModelOpen] = useState(false);
  return (
    note && (
      <Suspense>
        {isDisplayModelOpen && (
          <Model
            setIsOpen={setIsDisplayModelOpen}
            isOpen={isDisplayModelOpen}
            title={"Note"}
          >
            <NoteDisplayModel data={note} setIsOpen={setIsDisplayModelOpen} />
          </Model>
        )}
        <button
          onClick={() => setIsDisplayModelOpen(true)}
          className="w-full text-left flex my-2 gap-2"
        >
          <div className="w-[40px] h-[40px] bg-bg flex items-center justify-center">
            <div>
              <Icon
                icon="material-symbols:sticky-note-2-outline"
                className="text-lg"
              />
            </div>
          </div>
          <div className="flex-1 h-full flex flex-col bg-bg min-h-[70px] p-2 text-sm">
            <div
              className="flex-1"
              dangerouslySetInnerHTML={{ __html: note.noteBody }}
            ></div>
            <div className="mt-2 text-textDark flex gap-3 items-center justify-between text-xs">
              <div className="flex gap-3 items-center">
                <span className="bg-green-600 py-1 px-2 rounded-full text-white">
                  Added
                </span>
                <span>{moment(note.createdAt).fromNow()}</span>
                <span>{note?.creator?.fullname}</span>
              </div>
              {/* <div className="flex gap-1">
                <button disabled={isLoading} className="btn-outlined btn-small">
                  <Icon icon="uil:pen" />
                </button>
                <button
                  disabled={isLoading}
                  className="btn-outlined btn-small"
                  onClick={handleDeleteNote}
                >
                  <Icon icon="uil:trash" />
                </button>
              </div> */}
            </div>
          </div>
        </button>
      </Suspense>
    )
  );
};

export default NoteCard;
