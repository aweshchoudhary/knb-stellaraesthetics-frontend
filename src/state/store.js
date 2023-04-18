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

const store = configureStore({
  reducer: {
    [dealApi.reducerPath]: dealApi.reducer,
    [labelApi.reducerPath]: labelApi.reducer,
    [stageApi.reducerPath]: stageApi.reducer,
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
      .concat(stageApi.middleware),
});

export default store;
