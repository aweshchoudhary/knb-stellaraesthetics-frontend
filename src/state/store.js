import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import globalSlice from "./features/globalSlice";
import stageSlice from "./features/stageSlice";
import dealSlice from "./features/dealFeatures/dealSlice";
import noteSlice from "./features/dealFeatures/noteSlice";
import activitySlice from "./features/dealFeatures/activitySlice";
import labelSlice from "./features/labelSlice";
import clientSlice from "./features/clientSlice";
import { dealApi } from "../services/dealApi";
import { labelApi } from "../services/labelApi";
import { stageApi } from "../services/stageApi";
import { clientApi } from "../services/clientApi";
import { pipelineApi } from "../services/pipelineApi";
import { activityApi } from "../services/activityApi";
import { noteApi } from "../services/noteApi";
import { fileApi } from "../services/fileApi";

const store = configureStore({
  reducer: {
    [dealApi.reducerPath]: dealApi.reducer,
    [labelApi.reducerPath]: labelApi.reducer,
    [stageApi.reducerPath]: stageApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [pipelineApi.reducerPath]: pipelineApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
    deals: dealSlice,
    note: noteSlice,
    activity: activitySlice,
    stages: stageSlice,
    global: globalSlice,
    auth: authSlice,
    label: labelSlice,
    client: clientSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(dealApi.middleware)
      .concat(stageApi.middleware)
      .concat(clientApi.middleware)
      .concat(labelApi.middleware)
      .concat(pipelineApi.middleware)
      .concat(noteApi.middleware)
      .concat(activityApi.middleware)
      .concat(fileApi.middleware),
});

export default store;
