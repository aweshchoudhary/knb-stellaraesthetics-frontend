import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
  isMobileOpen: false,
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
  },
});

export const { toggleDarkMode, toggleMobileOpen } = globalSlice.actions;
export default globalSlice.reducer;
