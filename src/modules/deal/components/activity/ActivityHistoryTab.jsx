import React from "react";
import ActivityCard from "./ActivityCard";

const ActvityHistoryTab = ({ activities = [] }) => {
  return (
    <ul>
      {activities.length !== 0 ? (
        activities.map((history, index) => {
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
  );
};

export default ActvityHistoryTab;
