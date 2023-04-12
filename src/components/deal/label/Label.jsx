import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import CreateLabel from "./CreateLabel";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../global/Loader";
import { getLabels } from "../../../state/features/labelSlice";

const Label = ({ setLabel, label }) => {
  const { data, loading, success, error } = useSelector((state) => state.label);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNewLabelModel, setIsOpenNewLabelModel] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLabels());
  }, [success]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full border py-2 px-3 text-sm rounded mb-2 flex items-center justify-between"
      >
        {label ? (
          data.map(
            (item, index) =>
              item._id === label && (
                <li className="flex items-center gap-2 hover:bg-paper cursor-pointer">
                  <div
                    className="color w-[20px] h-[20px]"
                    style={{ background: item.color }}
                  ></div>
                  <span>{item.name}</span>
                </li>
              )
          )
        ) : (
          <>
            <span>Add Label</span>
            <Icon icon={"uil:arrow-down"} className="text-lg" />
          </>
        )}
      </button>
      {isOpen && (
        <ul className="label-list shadow-lg border absolute z-[100] w-full left-0 bg-bg">
          {!loading ? (
            data.length ? (
              data.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      setLabel((prev) => {
                        return {
                          ...prev,
                          label: item._id,
                        };
                      });
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-paper cursor-pointer"
                  >
                    <div
                      className="color w-[20px] h-[20px]"
                      style={{ background: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </li>
                );
              })
            ) : (
              <li className="p-2 text-center">No labels to show</li>
            )
          ) : (
            <li className="p-2 flex justify-center items-center">
              <Loader />
            </li>
          )}
          <li
            onClick={() => setIsOpenNewLabelModel(true)}
            className="capitalize flex items-center gap-2 hover:bg-primary hover:text-white cursor-pointer border-t p-2"
          >
            <Icon icon="uil:plus" />
            <span>create new label</span>
          </li>
        </ul>
      )}

      {isOpenNewLabelModel && (
        <div className="absolute -top-[200px] left-0">
          <CreateLabel setIsOpen={setIsOpenNewLabelModel} />
        </div>
      )}
    </div>
  );
};

export default Label;
