import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import moment from "moment";
import Loader from "../global/Loader";
import { toast } from "react-toastify";
import { useEffect } from "react";
import {
  getActivitiesByCardId,
  updateActivity,
} from "../../state/features/dealFeatures/activitySlice";
import { deleteActivity } from "../../state/features/dealFeatures/activitySlice";

const FocusActivities = () => {
  return (
    <div className="my-4">
      <header className="mb-3">
        <h2 className="text-lg font-medium">Focus Activity</h2>
      </header>
      <Activites />
    </div>
  );
};

const Activites = () => {
  const deal = useSelector((state) => state.deals);
  const { data, loading, success } = useSelector((state) => state.activity);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getActivitiesByCardId(deal.data._id));
  }, [deal.data._id, success]);
  return !loading ? (
    <div>
      <ul>
        {data.length ? (
          data?.map((activity, index) => {
            return (
              <li key={index}>
                <ActivityCard data={activity} />
              </li>
            );
          })
        ) : (
          <section className="w-full h-[100px] bg-bg my-4 flex items-center justify-center">
            <p>No notes to show</p>
          </section>
        )}
      </ul>
    </div>
  ) : (
    <section className="w-full h-[100px] bg-bg my-4 flex items-center justify-center">
      <Loader />
    </section>
  );
};

const ActivityCard = ({ data }) => {
  const dispatch = useDispatch();
  function handleDeleteActivity() {
    dispatch(deleteActivity(data._id));
  }
  function handleMarkDoneActivity() {
    dispatch(
      updateActivity({
        id: data._id,
        update: {
          markDone: true,
        },
      })
    );
  }
  return (
    <div className="flex">
      <div className="w-[60px] flex flex-col items-center">
        <span className="w-[40px] h-[40px] rounded-full bg-bg flex items-center justify-center">
          <Icon icon={"material-symbols:sticky-note-2-outline"} />
        </span>
        <div className="line border-l-2 flex-1"></div>
      </div>
      <div className="bg-bg mb-2 p-3 text-sm flex-1">
        <header className="flex items-center justify-between ">
          <div className="flex gap-2 items-center">
            <button
              className="w-[15px] h-[15px] rounded-full border-2 hover:border-textColor grow-0 shrink-0"
              onClick={handleMarkDoneActivity}
              title="Mark Done"
            ></button>
            <span className="capitalize font-medium text-lg text-textColor">
              {data.title}
            </span>
          </div>
          <div className="flex gap-1">
            <button className="btn-outlined btn-small">
              <Icon icon={"uil:pen"} />
            </button>
            <button
              className="btn-outlined btn-small"
              onClick={handleDeleteActivity}
            >
              <Icon icon={"uil:trash"} />
            </button>
          </div>
        </header>
        <div className="mt-2">
          {data.description && <div className="mb-2">{data.description}</div>}
          <div className="flex gap-3 text-sm ">
            <span>{moment(data.endDate).fromNow()}</span>
            <span>Awesh Choudhary</span>
            {data.location && (
              <span className="flex items-center gap-1">
                <Icon icon="material-symbols:location-on" />
                {data.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusActivities;
