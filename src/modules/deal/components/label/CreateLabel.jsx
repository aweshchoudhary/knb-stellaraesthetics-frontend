import React, { Suspense, useEffect, useState } from "react";
import { useCreateLabelMutation } from "@/redux/services/labelApi";
import { toast } from "react-toastify";

const CreateLabel = ({ setIsOpen }) => {
  const [name, setName] = useState("");
  const [createLabel, { isError, error }] = useCreateLabelMutation();

  const colorList = ["#fc0303", "#008502", "#0040d6", "#d6bd00", "#d600ab"];
  const [color, setColor] = useState(colorList[0]);

  async function createLabelFn() {
    await createLabel({ name, color });
    clear();
  }

  function clear() {
    setName("");
    setColor(colorList[0]);
    setIsOpen(false);
  }
  useEffect(() => {
    toast.error(error);
  }, [isError]);
  return (
    <Suspense>
      <div className="bg-bg border shadow-lg">
        <header className="p-2 bg-paper">
          <h2>New Label</h2>
        </header>
        <div className="py-5 px-3">
          <div>
            <label className="mb-2 block">Label Name</label>
            <input
              type="text"
              placeholder="Label name"
              id="name"
              name="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <ul className="flex gap-2">
              {colorList.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={`w-[25px] h-[25px] border-textColor cursor-pointer rounded-full ${
                      item === color ? "border-2" : "hover:border-2"
                    }`}
                    style={{ background: item }}
                    onClick={() => setColor(item)}
                  ></li>
                );
              })}
            </ul>
          </div>
        </div>
        <footer className="p-2 bg-paper flex items-center gap-2 justify-end">
          <button
            type="button"
            className="btn-outlined btn-small"
            onClick={clear}
          >
            cancel
          </button>
          <button
            type="button"
            className="btn-filled btn-small"
            onClick={createLabelFn}
          >
            save
          </button>
        </footer>
      </div>
    </Suspense>
  );
};

export default CreateLabel;
