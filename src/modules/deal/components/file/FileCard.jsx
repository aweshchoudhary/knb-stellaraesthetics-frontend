import { Icon } from "@iconify/react";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";

const FileCard = ({ file }) => {
  return (
    <div className="w-full flex my-2 gap-2">
      <div className="w-[40px] h-[40px] bg-bg flex items-center justify-center">
        <div>
          <Icon icon="ic:baseline-attach-file" className="text-lg" />
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col bg-bg p-2 text-sm">
        <div className="flex-1">
          <Link className="text-primary hover:underline">{file.name}</Link>
        </div>
        <div className="mt-2 text-textDark flex gap-3 items-center text-xs">
          <span className="bg-green-600 py-1 px-2 rounded-full text-white">
            Uploaded
          </span>
          <span>{moment(file.createdAt).fromNow()}</span>
          <span>{file?.uploader?.fullname}</span>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
