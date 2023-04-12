import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
  data: [],
  loading: false,
  success: false,
  error: null,
};

export const createLabel = createAsyncThunk("createLabel", async (data) => {
  try {
    await axiosInstance.post("/api/label/add", data);
    return "Label has been created";
  } catch (err) {
    return err.message;
  }
});
export const getLabels = createAsyncThunk("getLabels", async (data) => {
  try {
    const { data } = await axiosInstance.get("/api/label/get-labels");
    return data.data;
  } catch (err) {
    return err.message;
  }
});
export const getLabelById = createAsyncThunk("getLabelById", async (id) => {
  try {
    const { data } = await axiosInstance.get("/api/label/get-label/" + id);
    return data.data;
  } catch (err) {
    return err.message;
  }
});
export const updateLabel = createAsyncThunk("updateLabel", async (data) => {
  try {
    const { data } = await axiosInstance.put(
      "/api/label/update/" + data.id,
      data.data
    );
    return data.data;
  } catch (err) {
    return err.message;
  }
});
export const deleteLabel = createAsyncThunk("deleteLabel", async (id) => {
  try {
    await axiosInstance.delete("/api/label/delete/" + id);
    return "Label has been deleted";
  } catch (err) {
    return err.message;
  }
});

const labelSlice = createSlice({
  name: "label",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createLabel.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(createLabel.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(createLabel.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    builder.addCase(getLabels.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(getLabels.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.error = null;
    });
    builder.addCase(getLabels.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    builder.addCase(getLabelById.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(getLabelById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.error = null;
    });
    builder.addCase(getLabelById.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });
    builder.addCase(updateLabel.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(updateLabel.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(updateLabel.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });
    builder.addCase(deleteLabel.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(deleteLabel.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(deleteLabel.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });
  },
});

// export const { toggleDarkMode, toggleMobileOpen } = labelSlice.actions;
export default labelSlice.reducer;
