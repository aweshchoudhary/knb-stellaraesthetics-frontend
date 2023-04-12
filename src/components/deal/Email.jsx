import { useState } from "react";
import RichTextEditor from "../global/RichTextEditor";

const Email = () => {
  const [emailBody, setEmailBody] = useState("");
  return (
    <section>
      <div className="p-5">
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
      <footer className="flex gap-2 px-5 py-3 border-t">
        <button className="btn-outlined">cancel</button>
        <button className="btn-filled">send email</button>
      </footer>
    </section>
  );
};

export default Email;
