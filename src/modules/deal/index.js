import { lazy } from "react";

export const Deal = lazy(() => import("./pages/Deal"));

export const DealCard = lazy(() => import("./components/DealCard"));
export const DealSelect = lazy(() => import("./components/DealSelect"));
export const DealSideBar = lazy(() => import("./components/DealSideBar"));

export const ActivityHandler = lazy(() =>
  import("./components/activity/ActivityHandler")
);
export const EmailHandler = lazy(() =>
  import("./components/email/EmailHandler")
);
export const FileHandler = lazy(() => import("./components/file/FileHandler"));
export const NoteHandler = lazy(() => import("./components/note/NoteHandler"));

export const ActivitiesTabs = lazy(() =>
  import("./components/FocusActivitiesTabs")
);
export const ActivityDisplayModel = lazy(() =>
  import("./components/activity/ActivityDisplayModel")
);

export const HistoryTabs = lazy(() =>
  import("./components/history/HistoryTabsContainer")
);

export const CreateDealForm = lazy(() =>
  import("./components/models/CreateDealForm")
);
export const CreateDealModel = lazy(() =>
  import("./components/models/CreateDealModel")
);

export const CreateLabel = lazy(() => import("./components/label/CreateLabel"));
export const Label = lazy(() => import("./components/label/Label"));

import useActivityStatus from "./hooks/useActivityStatus";
export { useActivityStatus };
