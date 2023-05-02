import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
  isMobileOpen: false,
  pipelineIndex: localStorage.getItem("pipelineIndex") || 0,
  accessToken: localStorage.getItem("accessToken") || null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode);
    },
    toggleMobileOpen(state) {
      state.isMobileOpen = !state.isMobileOpen;
    },
    addPipeline(state, { payload }) {
      state.pipelineIndex = payload;
      localStorage.setItem("pipelineIndex", payload);
    },
    removePipeline(state) {
      state.pipelineIndex = "";
      localStorage.removeItem("pipelineIndex");
    },
    addAccessToken(state, { payload }) {
      state.accessToken = payload;
      localStorage.setItem("accessToken", payload);
    },
    removeAccessToken(state) {
      state.accessToken = null;
      localStorage.removeItem("accessToken");
    },
  },
});

export const {
  toggleDarkMode,
  toggleMobileOpen,
  addPipeline,
  removePipeline,
  addAccessToken,
  removeAccessToken,
} = globalSlice.actions;
export default globalSlice.reducer;
