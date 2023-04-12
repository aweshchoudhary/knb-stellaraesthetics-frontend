import { createSlice } from "@reduxjs/toolkit";

const PROJECTID =
  "oidc.user:https://au.stellaraesthetics.in/:206769574157323753@authentication_with_react";
const initialState = {
  user: JSON.parse(sessionStorage.getItem(PROJECTID)) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      sessionStorage.removeItem(PROJECTID);
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
