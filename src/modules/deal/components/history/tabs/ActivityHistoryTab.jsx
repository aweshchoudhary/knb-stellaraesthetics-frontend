import React, { useEffect, useState } from "react";
import ActivityCard from "../cards/ActivityCard";
import { useLazyGetActivitiesQuery } from "@/redux/services/activityApi";

const ActvityHistoryTab = ({ dealId }) => {
  const [activityHistory, setNoteHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [getActivities] = useLazyGetActivitiesQuery();

  useEffect(() => {
    const fetchHistories = async () => {
      setLoading(true);
      const activityData = await getActivities({
        filters: JSON.stringify([{ id: "deals", value: { $in: [dealId] } }]),
        data: true,
      });
      activityData.data.length !== 0 && setNoteHistory(activityData.data);
      setLoading(false);
    };
    fetchHistories();
  }, [dealId]);
  return (
    !loading && (
      <ul>
        {activityHistory.length !== 0 ? (
          activityHistory.map((history, index) => {
            return (
              <li key={index}>
                <ActivityCard activity={history} />
              </li>
            );
          })
        ) : (
          <section className="p-10 text-center bg-bg mt-3">
            <p>No history to show</p>
          </section>
        )}
      </ul>
    )
  );
};

export default ActvityHistoryTab;
