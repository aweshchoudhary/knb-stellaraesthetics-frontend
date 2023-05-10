import { lazy } from "react";

const Pipelines = lazy(() => import("./pages/Pipelines"));
const Pipeline = lazy(() => import("./pages/Pipeline"));

const PipelineView = lazy(() => import("./components/PipelineView"));
const EditPipelineView = lazy(() => import("./components/EditPipelineView"));
const EditPipelineName = lazy(() => import("./components/EditPipelineName"));
const PipelineTable = lazy(() => import("./components/PipelineTable"));

const CreatePipelineModel = lazy(() =>
  import("./components/model/CreatePipelineModel")
);
const CreateStageModel = lazy(() =>
  import("./components/model/CreateStageModel")
);
const PipelineUsersModel = lazy(() =>
  import("./components/model/PipelineUsersModel")
);

const Column = lazy(() => import("./components/stage/Column"));
const EditColumn = lazy(() => import("./components/stage/EditColumn"));
const EditStages = lazy(() => import("./components/stage/EditStages"));
const Row = lazy(() => import("./components/stage/Row"));
const Stages = lazy(() => import("./components/stage/Stages"));

export {
  Pipelines,
  Pipeline,
  PipelineView,
  EditPipelineView,
  EditPipelineName,
  PipelineTable,
  CreatePipelineModel,
  CreateStageModel,
  PipelineUsersModel,
  Column,
  EditColumn,
  EditStages,
  Row,
  Stages,
};
