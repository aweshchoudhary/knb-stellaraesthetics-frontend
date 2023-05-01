import { configureStore } from "@reduxjs/toolkit";
// import authSlice from "./features/authSlice";
import globalSlice from "./features/globalSlice";
// import stageSlice from "./features/stageSlice";
// import dealSlice from "./features/dealFeatures/dealSlice";
// import noteSlice from "./features/dealFeatures/noteSlice";
// import activitySlice from "./features/dealFeatures/activitySlice";
// import labelSlice from "./features/labelSlice";
// import contactSlice from "./features/contactSlice";
import { dealApi } from "../services/dealApi";
import { labelApi } from "../services/labelApi";
import { stageApi } from "../services/stageApi";
import { contactApi } from "../services/contactApi";
import { pipelineApi } from "../services/pipelineApi";
import { activityApi } from "../services/activityApi";
import { noteApi } from "../services/noteApi";
import { fileApi } from "../services/fileApi";

const store = configureStore({
  reducer: {
    [dealApi.reducerPath]: dealApi.reducer,
    [labelApi.reducerPath]: labelApi.reducer,
    [stageApi.reducerPath]: stageApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [pipelineApi.reducerPath]: pipelineApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
    global: globalSlice,
    // deals: dealSlice,
    // note: noteSlice,
    // activity: activitySlice,
    // stages: stageSlice,
    // auth: authSlice,
    // label: labelSlice,
    // contact: contactSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      pipelineApi.middleware,
      stageApi.middleware,
      dealApi.middleware,
      contactApi.middleware,
      labelApi.middleware,
      noteApi.middleware,
      activityApi.middleware,
      fileApi.middleware,
    ]),
});

export default store;
