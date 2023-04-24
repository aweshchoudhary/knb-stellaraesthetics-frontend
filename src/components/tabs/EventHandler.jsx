import { Icon } from "@iconify/react";
import { useCallback, useEffect, useState } from "react";
import {
  useCreateActivityMutation,
  useLazyGetActivityQuery,
  useUpdateActivityMutation,
} from "../../services/activityApi";
import {
  useGetCardQuery,
  useLazyGetCardQuery,
  useLazySearchCardsQuery,
} from "../../services/dealApi";
import { useParams } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import Select from "react-select";

const activityOptions = [
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
];

const CreateActivity = ({ selectedInfo, setIsOpen, isUpdate, activityId }) => {
  const params = useParams();
  const { id } = params;
  const [query, setQuery] = useState("");

  const [
    getActivityById,
    { isLoading: isActivityLoading, isFetching: isActivityFetching },
  ] = useLazyGetActivityQuery();
  const [
    searchCard,
    {
      isLoading: isSearching,
      isFetching: isSearchFetching,
      isSuccess: isSearchSuccess,
    },
  ] = useLazySearchCardsQuery();
  const [createActivity, { isLoading, isCreateSuccess }] =
    useCreateActivityMutation();
  const [
    updateActivity,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateActivityMutation();
  const { data: card } = useGetCardQuery(id);

  const [searchedCards, setSearchedCards] = useState(
    card ? [{ label: card.title, value: card._id }] : []
  );
  const [selectedCard, setSelectedCard] = useState(
    card
      ? {
          label: card.title,
          value: card._id,
        }
      : null
  );

  const [eventInfo, setEventInfo] = useState({
    title: "call",
    type: "call",
    startDate: selectedInfo ? selectedInfo.startStr : "",
    endDate: selectedInfo ? selectedInfo.endStr : "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    cardId: id,
    holder: "asdfasdfasdfasdfsadfsadfas",
  });

  const [additionalFields, setAdditionalFields] = useState({
    description: false,
    location: false,
  });

  async function handleCreateActivity() {
    await createActivity(eventInfo);
    handleCancel();
  }

  async function handleUpdateActivity() {
    await updateActivity({
      id: activityId,
      update: eventInfo,
    });
    handleCancel();
  }
  function setAdditionalFieldsFn(name) {
    setAdditionalFields((prev) => {
      return { ...prev, [name]: !prev[name] };
    });
  }
  function handleCancel() {
    setEventInfo({
      title: "call",
      type: "call",
      startDate: selectedInfo ? selectedInfo.startStr : "",
      endDate: selectedInfo ? selectedInfo.endStr : "",
      startTime: "",
      endTime: "",
      location: "",
      description: "",
      cardId: id,
      holder: "asdfasdfasdfasdfsadfsadfas",
    });
    setIsOpen && setIsOpen(false);
  }
  function fillEventInfo(name, value) {
    setEventInfo((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    const fetchActivity = async (activityId) => {
      const res = await getActivityById(activityId);
      if (res.data) {
        const activityData = res.data;
        setTitle(activityData.title);
        setType(activityData.type);
        setStartDate(moment(activityData.startDate).format("YYYY-MM-DD"));
        setStartTime(activityData.startTime);
        setEndDate(moment(activityData.endDate).format("YYYY-MM-DD"));
        setEndTime(activityData.endTime);
        setHolder(activityData.holder);

        if (activityData?.location) {
          setAdditionalFieldsFn("location");
          setLocation(activityData.location);
        }
        if (activityData?.description) {
          setAdditionalFieldsFn("description");
          setDescription(activityData.description);
        }
      }
    };

    if (activityId && isUpdate) fetchActivity(activityId);
  }, [activityId]);
  useEffect(() => {
    const searchCardFn = async (query) => {
      const res = await searchCard(query);
      if (res.data) {
        const cards = res.data.map((item) => {
          return {
            label: item.title,
            value: {
              title: item.title,
              id: item._id,
            },
          };
        });
        setSearchedCards(cards);
      }
    };
    query.length > 2 && searchCardFn(query);
  }, [query]);
  // useEffect(() => {
  //   const fetchCardById = async (cardId) => {
  //     const res = await getCardById(cardId);
  //     if (res.data) {
  //       const cardData = res.data;
  //       setSelectedCard(cardData.title);
  //       setSearchedCards((prev) => [...prev, cardData.title]);
  //     }
  //   };
  //   id.length > 2 && !isGetCardSuccess && fetchCardById(id);
  // }, [id]);
  useEffect(() => {
    if (isCreateSuccess) toast.success("Activity has been created");
  }, [isCreateSuccess]);
  useEffect(() => {
    if (isUpdateSuccess) toast.success("Activity has been updated");
  }, [isUpdateSuccess]);

  console.log(eventInfo.startTime);

  return (
    <section>
      <div className="container p-5">
        <div className="my-2">
          <input
            type="text"
            name="title"
            id="activity-name"
            placeholder={eventInfo.title}
            className="input"
            value={eventInfo.title}
            onChange={(e) => fillEventInfo(e.target.name, e.target.value)}
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
                  item.type === eventInfo.type
                    ? "border-textColor"
                    : "hover:border-textColor"
                } p-3 border border-collapse`}
                onClick={() => {
                  fillEventInfo("type", item.type);
                  fillEventInfo("title", item.title);
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
                onChange={(e) => fillEventInfo(e.target.name, e.target.value)}
                value={eventInfo.startDate}
              />
              <input
                type="time"
                className="input flex-1"
                name="start-time"
                id="start-time"
                onChange={(e) => fillEventInfo(e.target.name, e.target.value)}
                value={eventInfo.startTime}
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
                onChange={(e) => fillEventInfo(e.target.name, e.target.value)}
                value={eventInfo.endTime}
              />
              <input
                type="date"
                className="input flex-1"
                name="end-date"
                id="end-date"
                onChange={(e) => fillEventInfo(e.target.name, e.target.value)}
                value={eventInfo.endDate}
              />
            </div>
          </div>
        </div>
        <div className="my-4">
          <h3 className="text-lg font-medium mb-3">Additional Fields</h3>
          <div className="additional-fields flex mb-4 items-center gap-2">
            <button
              className="btn-outlined"
              onClick={() => setAdditionalFieldsFn("location")}
              disabled={additionalFields.location}
            >
              <Icon icon={"material-symbols:location-on"} className="text-xl" />
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
                onChange={(e) => fillEventInfo(e.target.name, e.target.value)}
                value={eventInfo.description}
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
                onChange={(e) => fillEventInfo(e.target.name, e.target.value)}
                value={eventInfo.location}
              />
            </div>
          )}
        </div>
        <div className="my-2">
          <h2 className="mb-1">Deal</h2>
          <Select
            id="deal"
            name="deal"
            label="deal"
            options={searchedCards}
            value={selectedCard}
            placeholder="Search Deal"
            onChange={(value) => {
              if (value) {
                setSelectedCard(value.title);
                fillEventInfo("cardId", value.id);
              }
            }}
            onInputChange={(value) => setQuery(value)}
            className="mb-2 text-sm"
          ></Select>
        </div>
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
        <button
          className="btn-outlined"
          disabled={isLoading}
          onClick={handleCancel}
        >
          cancel
        </button>
        {isUpdate ? (
          <button
            className="btn-filled"
            disabled={isActivityLoading || isActivityFetching || isUpdating}
            onClick={handleUpdateActivity}
          >
            {isLoading ? "Loading..." : "Update"}
          </button>
        ) : (
          <button
            className="btn-filled"
            disabled={isLoading}
            onClick={handleCreateActivity}
          >
            {isLoading ? "Loading..." : "save"}
          </button>
        )}
      </footer>
    </section>
  );
};

export default CreateActivity;
