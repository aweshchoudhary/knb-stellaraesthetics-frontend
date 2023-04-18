import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { dealApi } from "./deal/dealApi";

export const store = configureStore({
  reducer: {
    [dealApi.reducerPath]: dealApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dealApi.middleware),
});

setupListeners(store.dispatch);
