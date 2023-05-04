import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  loggedUserId: localStorage.getItem("userId") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      if (payload?.accessToken) {
        state.accessToken = payload.accessToken;
        localStorage.setItem("accessToken", payload.accessToken);
      }
      if (payload?.userId) {
        state.loggedUserId = payload.userId;
        localStorage.setItem("userId", payload.userId);
      }
    },
    logOut: (state) => {
      state.accessToken = null;
      state.loggedUserId = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.accessToken;
