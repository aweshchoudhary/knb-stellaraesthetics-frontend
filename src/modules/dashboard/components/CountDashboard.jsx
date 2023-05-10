import React, { Suspense } from "react";

const CountDashboard = ({ title, count }) => {
  return (
    <Suspense>
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{title}</h2>
        <p>{count}</p>
      </div>
    </Suspense>
  );
};

export default CountDashboard;
