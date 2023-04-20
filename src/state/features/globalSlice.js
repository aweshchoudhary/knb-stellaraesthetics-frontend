import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
  isMobileOpen: false,
  pipelineIndex: localStorage.getItem("pipelineIndex") || 0,
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
    changePipeline(state, { payload }) {
      state.pipelineIndex = payload;
      localStorage.setItem("pipelineIndex", payload);
    },
  },
});

export const { toggleDarkMode, toggleMobileOpen, changePipeline } =
  globalSlice.actions;
export default globalSlice.reducer;
