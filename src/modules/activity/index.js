import { lazy } from "react";

const Activity = lazy(() => import("./pages/Activity"));

const ActivityDisplayModel = lazy(() =>
  import("./components/ActivityDisplayModel")
);
const ActivityList = lazy(() => import("./components/ActivityList"));
const Calendar = lazy(() => import("./components/Calendar"));
const ActivityStatus = lazy(() => import("./components/ActivityStatus"));

export {
  Activity,
  ActivityStatus,
  ActivityList,
  Calendar,
  ActivityDisplayModel,
};
