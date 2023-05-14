import { Icon } from "@iconify/react";
import React, { Suspense, useEffect, useState } from "react";
import {
  useCreateActivityMutation,
  useLazyGetActivityQuery,
  useUpdateActivityMutation,
} from "@/redux/services/activityApi";
import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";
import { DealSelect } from "@/modules/deal";
import ReactDatePicker from "react-datepicker";
import { ContactSelect } from "@/modules/contact";
import { useSelector } from "react-redux";

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

const ActivityHandler = ({
  selectedInfo,
  setIsOpen,
  isUpdate,
  activityId,
  cards = [],
  contacts = [],
}) => {
  const [selectedDeals, setSelectedDeals] = useState(cards);
  const [selectedContacts, setSelectedContacts] = useState(contacts);

  const user = useSelector((state) => state.auth);

  const [eventInfo, setEventInfo] = useState({
    title: "Call",
    type: "call",
    startDateTime: selectedInfo ? selectedInfo.start : new Date(),
    endDateTime: selectedInfo ? selectedInfo.end : new Date(),
    location: "",
    description: "",
    deals: [],
    contacts: [],
    performer: user.loggedUserId,
  });

  const [
    getActivityById,
    { isLoading: isActivityLoading, isFetching: isActivityFetching },
  ] = useLazyGetActivityQuery();

  const [createActivity, { isLoading, isCreateSuccess }] =
    useCreateActivityMutation();

  const [
    updateActivity,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateActivityMutation();

  const [additionalFields, setAdditionalFields] = useState({
    description: false,
    location: false,
  });

  async function handleCreateActivity() {
    const filterDealId = selectedDeals.map((item) => item.value);
    const filterContactId = selectedContacts.map((item) => item.value);
    const newActivity = {
      ...eventInfo,
      deals: filterDealId,
      contacts: filterContactId,
    };
    await createActivity(newActivity);
  }
  async function handleUpdateActivity() {
    await updateActivity({
      id: activityId,
      update: eventInfo,
    });
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
      startDateTime: selectedInfo ? selectedInfo.start : new Date(),
      endDateTime: selectedInfo ? selectedInfo.end : new Date(),
      location: "",
      description: "",
      dealId: selectedDeals,
      performer: "",
      icon: "uil:phone",
    });
    setAdditionalFields({
      description: false,
      location: false,
    });

    setIsOpen && setIsOpen(false);
  }

  function fillEventInfo(name, value) {
    setEventInfo((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    let isMounted = true;
    const fetchActivity = async (activityId) => {
      const res = await getActivityById(activityId);
      if (res.data) {
        const activityData = res.data;
        setEventInfo({ ...activityData });

        if (activityData?.location) {
          setAdditionalFieldsFn("location");
        }
        if (activityData?.description) {
          setAdditionalFieldsFn("description");
        }
      }
    };

    isMounted &&
      activityId &&
      isUpdate &&
      isUpdate &&
      fetchActivity(activityId);
  }, [activityId, isUpdate]);

  useEffect(() => {
    if (isCreateSuccess) {
      toast.success("Activity has been created");
      handleCancel();
    }
  }, [isCreateSuccess]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Activity has been updated");
      handleCancel();
    }
  }, [isUpdateSuccess]);
  return !isActivityLoading && !isActivityFetching ? (
    <Suspense fallback={<SkeletonLoader />}>
      <div className="container p-5">
        <div className="my-2">
          <h2 className="mb-1">Activity Title</h2>
          <input
            type="text"
            name="title"
            id="activity-name"
            placeholder={"Create activity title"}
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
                  fillEventInfo("title", item.name);
                  fillEventInfo("type", item.type);
                  fillEventInfo("icon", item.icon);
                }}
              >
                <Icon icon={item.icon} className="text-lg" />
              </button>
            );
          })}
        </div>
        <div className="my-5">
          <h3 className="text-lg font-medium mb-3">Date and Time</h3>
          <div className="flex gap-2">
            <div className="flex-1">
              <h2 className="mb-1">Start Date and Time</h2>
              <ReactDatePicker
                selected={eventInfo.startDateTime}
                onChange={(date) => fillEventInfo("startDateTime", date)}
                className="input"
                minDate={new Date()}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
              />
            </div>
            <div className="flex-1">
              <h2 className="mb-1">End Date and Time</h2>
              <ReactDatePicker
                selected={eventInfo.endDateTime}
                onChange={(date) => fillEventInfo("endDateTime", date)}
                minDate={new Date()}
                className="input"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
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
        <div className="my-3 ">
          <p className="mb-1">Deals</p>
          <DealSelect
            selectedData={selectedDeals}
            setSelectedData={setSelectedDeals}
            compare={cards}
          />
        </div>
        <div className="my-3">
          <p className="mb-1">Contacts</p>
          <ContactSelect
            selectedData={selectedContacts}
            setSelectedData={setSelectedContacts}
            compare={contacts}
          />
        </div>
        <div className="task-performer">
          <p className="mb-1">Activity Performer</p>
          <div className="input">{user.loggedUserName}</div>
        </div>
      </div>
      <footer className="modal-footer">
        <button
          className="btn-outlined btn-small"
          disabled={isLoading}
          onClick={handleCancel}
        >
          cancel
        </button>
        {isUpdate ? (
          <button
            className="btn-filled btn-small"
            disabled={isActivityLoading || isActivityFetching || isUpdating}
            onClick={handleUpdateActivity}
          >
            {isLoading ? "Loading..." : "Update"}
          </button>
        ) : (
          <button
            className="btn-filled btn-small"
            disabled={isLoading}
            onClick={handleCreateActivity}
          >
            {isLoading ? "Loading..." : "save"}
          </button>
        )}
      </footer>
    </Suspense>
  ) : (
    <SkeletonLoader />
  );
};

const SkeletonLoader = () => {
  return (
    <div className="p-5">
      <Skeleton
        variant="rectangular"
        height={35}
        sx={{ width: "100%" }}
        className="mb-3"
      />
      <div className="flex gap-3">
        <Skeleton variant="rectangular" height={35} className="mb-5 w-[65px]" />
        <Skeleton variant="rectangular" height={35} className="mb-5 w-[65px]" />
        <Skeleton variant="rectangular" height={35} className="mb-5 w-[65px]" />
        <Skeleton variant="rectangular" height={35} className="mb-5 w-[65px]" />
      </div>
      <Skeleton
        variant="rectangular"
        height={35}
        sx={{ width: "100%" }}
        className="mb-3"
      />
      <div className="flex gap-5">
        <Skeleton variant="rectangular" height={35} className="mb-5 flex-1" />
        <Skeleton variant="rectangular" height={35} className="mb-5 flex-1" />
        <Skeleton variant="rectangular" height={35} className="mb-5 flex-1" />
        <Skeleton variant="rectangular" height={35} className="mb-5 flex-1" />
      </div>
      <Skeleton
        variant="rectangular"
        height={35}
        sx={{ width: "100%" }}
        className="mb-3"
      />
      <div className="flex gap-3">
        <Skeleton variant="rectangular" height={35} className="mb-5 w-[65px]" />
        <Skeleton variant="rectangular" height={35} className="mb-5 w-[65px]" />
      </div>
      <Skeleton
        variant="rectangular"
        height={35}
        sx={{ width: "100%" }}
        className="mb-3"
      />
    </div>
  );
};

export default ActivityHandler;
