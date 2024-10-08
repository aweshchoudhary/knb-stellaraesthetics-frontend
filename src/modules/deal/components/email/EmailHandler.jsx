import React, { Suspense, useState } from "react";
import { RichTextEditor } from "@/modules/common";
import { DealSelect } from "@/modules/deal";

const Email = ({ cards = [] }) => {
  const [emailBody, setEmailBody] = useState("");
  const [selectedDeals, setSelectedDeals] = useState(cards);
  return (
    <Suspense>
      <div className="p-5">
        <div className="deals-select mb-3">
          <DealSelect
            selectedData={selectedDeals}
            setSelectedData={setSelectedDeals}
            compare={cards}
          />
        </div>
        <div className="sender-email mb-3">
          <input
            type="email"
            name="sender-email"
            id="sender-email"
            className="input"
            placeholder="Sender Email"
          />
        </div>
        <div className="receiver-email mb-3">
          <input
            type="email"
            name="reciever-email"
            id="reciever-email"
            className="input"
            placeholder="Receiver Email"
          />
        </div>
        <div className="subject mb-3">
          <input
            type="text"
            name="subject"
            id="subject"
            className="input"
            placeholder="Subject"
          />
        </div>
        <div className="email-body mb-3">
          <RichTextEditor setContent={setEmailBody} />
        </div>
      </div>
      <footer className="flex items-center px-5 py-3 border-t gap-2 justify-end">
        <button className="btn-outlined btn-small">cancel</button>
        <button className="btn-filled btn-small">send email</button>
      </footer>
    </Suspense>
  );
};

export default Email;
