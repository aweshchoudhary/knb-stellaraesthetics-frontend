import { lazy } from "react";

const Deal = lazy(() => import("./pages/Deal"));

const DealCard = lazy(() => import("./components/DealCard"));
const DealSelect = lazy(() => import("./components/DealSelect"));
const DealSideBar = lazy(() => import("./components/DealSideBar"));

const ActivitiesTabs = lazy(() =>
  import("./components/handlers/ActivitiesTabs")
);
const ActivityDisplayModel = lazy(() =>
  import("./components/handlers/ActivityDisplayModel")
);
const ActivityHandler = lazy(() =>
  import("./components/handlers/ActivityHandler")
);
const EmailHandler = lazy(() => import("./components/handlers/EmailHandler"));
const EventTabsContainer = lazy(() =>
  import("./components/handlers/EventTabsContainer")
);
const FileHandler = lazy(() => import("./components/handlers/FileHandler"));
const NoteHandler = lazy(() => import("./components/handlers/NoteHandler"));

const CreateDealForm = lazy(() => import("./components/models/CreateDealForm"));
const CreateDealModel = lazy(() =>
  import("./components/models/CreateDealModel")
);

const CreateLabel = lazy(() => import("./components/label/CreateLabel"));
const Label = lazy(() => import("./components/label/Label"));

export {
  Deal,
  DealCard,
  DealSelect,
  ActivitiesTabs,
  ActivityDisplayModel,
  ActivityHandler,
  EmailHandler,
  EventTabsContainer,
  FileHandler,
  NoteHandler,
  CreateDealForm,
  CreateDealModel,
  CreateLabel,
  Label,
  DealSideBar,
};
