import { Icon } from "@iconify/react";
import React from "react";

const EmailCard = () => {
  return (
    <div className="w-full flex my-2 gap-2">
      <div className="w-[40px] h-[40px] bg-bg flex items-center justify-center">
        <div>
          <Icon
            icon="material-symbols:mail-outline-rounded"
            className="text-lg"
          />
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col bg-bg p-2 text-sm">
        <div className="flex-1">
          <h2>This is activity title</h2>
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

export default EmailCard;
