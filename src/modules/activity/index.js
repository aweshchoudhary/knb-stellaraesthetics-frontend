import { lazy } from "react";

export const Activity = lazy(() => import("./pages/Activity"));
export const Calendar = lazy(() => import("./components/Calendar"));
export const ActivityStatus = lazy(() => import("./components/ActivityStatus"));
