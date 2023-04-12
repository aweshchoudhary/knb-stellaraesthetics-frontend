import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addActivity } from "../../state/features/dealFeatures/activitySlice";
import Loader from "../global/Loader";

const Activity = () => {
  const { data, loading, error, success } = useSelector((state) => state.deals);
  const [title, setTitle] = useState("call");
  const [type, setType] = useState("call");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [holder, setHolder] = useState("asdfasdfasdfasdfsadfsadfas");

  const dispatch = useDispatch();
  const [activityOptions, setActivityOptions] = useState([
    {
      id: 1,
      name: "Call",
      type: "call",
      icon: "uil:phone",
    },
    {
      id: 2,
      name: "Email",
      type: "email",
      icon: "uil:envelope",
    },
    {
      id: 3,
      name: "Meeting",
      type: "meeting",
      icon: "heroicons:users",
    },
    {
      id: 4,
      name: "Task",
      type: "task",
      icon: "material-symbols:timer-outline",
    },
  ]);
  const [additionalFields, setAdditionalFields] = useState({
    description: false,
    location: false,
  });
  function setAdditionalFieldsFn(name) {
    setAdditionalFields((prev) => {
      return { ...prev, [name]: !prev[name] };
    });
  }

  function handleSave() {
    const convertedStartDate = new Date(startDate).toISOString();
    const convertedEndDate = new Date(endDate).toISOString();

    dispatch(
      addActivity({
        title,
        type,
        startDate: convertedStartDate,
        startTime,
        endDate: convertedEndDate,
        endTime,
        description,
        location,
        cardId: data._id,
        holder,
      })
    );
    handleCancel();
  }
  function handleCancel() {
    setTitle("call");
    setType("call");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setDescription("");
  }
  return (
    data &&
    !loading && (
      <section>
        <div className="container p-5">
          <div className="my-2">
            <input
              type="text"
              name="activity-name"
              id="activity-name"
              placeholder={title}
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="my-2 activity-buttons border-collapse">
            {activityOptions.map((item, index) => {
              return (
                <button
                  key={index}
                  aria-label={item.name}
                  title={item.name}
                  className={`${
                    item.type === type
                      ? "border-textColor"
                      : "hover:border-textColor"
                  } p-3 border border-collapse`}
                  onClick={() => {
                    setType(item.type);
                    setTitle(item.type);
                  }}
                >
                  <Icon icon={item.icon} className="text-lg" />
                </button>
              );
            })}
          </div>
          <div className="my-5">
            <h2 className="mb-3">Date and Time</h2>
            <div className="flex">
              <div className="flex flex-1 gap-2 pr-2">
                <input
                  type="date"
                  className="input flex-1"
                  name="start-date"
                  id="start-time"
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                />
                <input
                  type="time"
                  className="input flex-1"
                  name="start-time"
                  id="start-time"
                  onChange={(e) => setStartTime(e.target.value)}
                  value={startTime}
                />
              </div>
              <div className="flex flex-1 gap-2 items-center">
                {" "}
                -{" "}
                <input
                  type="time"
                  className="input flex-1"
                  name="end-time"
                  id="end-time"
                  onChange={(e) => setEndTime(e.target.value)}
                  value={endTime}
                />
                <input
                  type="date"
                  className="input flex-1"
                  name="end-date"
                  id="end-date"
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                />
              </div>
            </div>
          </div>

          <section className="my-4">
            <h3 className="text-lg font-medium mb-3">Additional Fields</h3>
            <div className="additional-fields flex mb-4 items-center gap-2">
              <button
                className="btn-outlined"
                onClick={() => setAdditionalFieldsFn("location")}
                disabled={additionalFields.location}
              >
                <Icon
                  icon={"material-symbols:location-on"}
                  className="text-xl"
                />
                <p>location</p>
              </button>
              <button
                className="btn-outlined"
                disabled={additionalFields.description}
                onClick={() => setAdditionalFieldsFn("description")}
              >
                <Icon icon={"uil:bars"} className="text-xl" />
                <p>Description</p>
              </button>
            </div>
            {additionalFields.description && (
              <div className="description flex gap-2 items-start my-2">
                <button
                  className="text-xl pt-3"
                  onClick={() => setAdditionalFieldsFn("description")}
                >
                  <Icon icon="uil:trash" />
                </button>
                <textarea
                  name="description"
                  id="description"
                  className="input min-h-[100px] flex-1"
                  placeholder="Description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                ></textarea>
              </div>
            )}
            {additionalFields.location && (
              <div className="location flex gap-2 items-start my-2">
                <button
                  className="text-xl pt-3"
                  onClick={() => setAdditionalFieldsFn("location")}
                >
                  <Icon icon="uil:trash" />
                </button>
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="input"
                  placeholder="Location"
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                />
              </div>
            )}
          </section>
          <div className="task-performer">
            <h3 className="text-lg mb-3 font-medium">Activity Performer</h3>
            <div className="flex items-center gap-2">
              <Icon icon="uil:user" className="text-xl" />
              <select name="task-user" id="task-user" className="input flex-1">
                <option value="a4523df">Awesh Choudhary (You)</option>
                <option value="a4523df">John Doe</option>
                <option value="a4523df">John Jane</option>
              </select>
            </div>
          </div>
        </div>
        <footer className="flex items-center justify-end border-t mt-2s p-3 gap-2">
          <button className="btn-outlined" onClick={handleCancel}>
            {loading ? "Loading..." : "cancel"}
          </button>
          <button className="btn-filled" onClick={handleSave}>
            {loading ? "Loading..." : "save"}
          </button>
        </footer>
      </section>
    )
  );
};

export default Activity;
