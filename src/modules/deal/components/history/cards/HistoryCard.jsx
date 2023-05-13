import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HistoryCard = ({ history }) => {
  const [icon, setIcon] = useState("");

  useEffect(() => {
    switch (history.type) {
      case "note":
        setIcon("material-symbols:sticky-note-2-outline");
        break;
      case "activity":
        setIcon("material-symbols:timer-outline-rounded");
        break;
      case "file":
        setIcon("ic:baseline-attach-file");
        break;
      case "email":
        setIcon("material-symbols:mail-outline-rounded");
        break;
      default:
        setIcon("");
        break;
    }
  }, [history]);
  return (
    <div className="w-full flex my-2 gap-2">
      <div className="w-[40px] h-[40px] bg-bg flex items-center justify-center">
        <div>
          <Icon icon={icon} className="text-lg" />
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col bg-bg min-h-[70px] p-2 text-sm">
        <div className="flex-1">
          {history.type === "file" && (
            <Link className="text-primary hover:underline">
              This is activity title
            </Link>
          )}
          {history.type === "note" && <p>fasjdflksa</p>}
          {history.type === "activity" && <p>fasjdflksa</p>}
        </div>
        <div className="mt-2 text-textDark flex gap-3 items-center justify-between text-xs">
          <div className="flex gap-3 items-center">
            <span className="bg-green-600 py-1 px-2 rounded-full text-white">
              Added
            </span>
            <span>a second ago</span>
            <span>Awesh Choudhary</span>
          </div>
          <div className="flex gap-1">
            <button className="btn-outlined btn-small">
              <Icon icon="uil:pen" />
            </button>
            <button className="btn-outlined btn-small">
              <Icon icon="uil:trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
