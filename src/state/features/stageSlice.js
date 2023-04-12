import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";

// const olddata =[
//   {
//     id: "stage-1",
//     name: "requested",
//     deals: 0,
//     amount: 0,
//   },
//   {
//     id: "stage-2",
//     name: "to do",
//     deals: 0,
//     amount: 0,
//   },
//   {
//     id: "stage-3",
//     name: "in progress",
//     deals: 0,
//     amount: 0,
//   },
//   {
//     id: "stage-4",
//     name: "done",
//     deals: 0,
//     amount: 0,
//   },
// ];

const initialState = {
  data: [],
  loading: false,
  success: false,
  error: null,
};

export const getAllStages = createAsyncThunk("getAllStages", async () => {
  try {
    const res = await axiosInstance.get("/api/get-stages");
    return res.data.data;
  } catch (err) {
    return err.message;
  }
});
export const createStage = createAsyncThunk("createStage", async (data) => {
  try {
    await axiosInstance.post("/api/stage", data);
    return "Stage Created";
  } catch (err) {
    return err.message;
  }
});
export const updateStage = createAsyncThunk("updateStage", async (data) => {
  try {
    await axiosInstance.put("/api/stage/" + data.stageId, {
      name: data.name,
    });
    return "Stage updated";
  } catch (err) {
    return err.message;
  }
});
export const deleteStage = createAsyncThunk("deleteStage", async (id) => {
  try {
    await axiosInstance.delete("/api/stage/" + id);
    return "Stage Deleted";
  } catch (err) {
    return err.message;
  }
});
export const reorderStages = createAsyncThunk("reorderStages", async (data) => {
  try {
    await axiosInstance.put("/api/stage/reorder", data);
    return "Stages has been reordered";
  } catch (err) {
    return err.message;
  }
});

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    addTempItemToStage(state, { payload }) {
      state.data.forEach((stage) => {
        if (stage._id === payload.stageId) {
          stage.items.push(payload.item);
        }
      });
    },
    removeTempItemFromStage(state, { payload }) {
      state.data.forEach((stage) => {
        if (stage._id === payload.stageId) {
          stage.items.splice(payload.itemPosition, 1);
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllStages.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(getAllStages.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(getAllStages.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    //CREATE STAGE FUNCTIONS
    builder.addCase(createStage.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(createStage.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(createStage.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    //DELETED STAGE FUNCTIONS
    builder.addCase(deleteStage.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(deleteStage.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(deleteStage.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    //UPDATE STAGE FUNCTIONS
    builder.addCase(updateStage.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(updateStage.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(updateStage.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    //UPDATE STAGE FUNCTIONS
    builder.addCase(reorderStages.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(reorderStages.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(reorderStages.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });
  },
});

export const { addTempItemToStage, removeTempItemFromStage } =
  stageSlice.actions;
export default stageSlice.reducer;
