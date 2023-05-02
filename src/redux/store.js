import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "./features/globalSlice";
import { mainApi } from "./services/mainApi";
import authSlice from "./features/authSlice";

const store = configureStore({
  reducer: {
    [mainApi.reducerPath]: mainApi.reducer,
    global: globalSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mainApi.middleware),
});

export default store;
