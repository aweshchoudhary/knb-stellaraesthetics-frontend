import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../config/axiosInstance";

const initialState = {
  data: [],
  loading: false,
  success: false,
  error: null,
};
// API CALLS
export const getNotesByCardId = createAsyncThunk(
  "getNotesByCardId",
  async (cardId) => {
    try {
      const { data } = await axiosInstance.get("/api/note/get-notes/" + cardId);
      return data.data;
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }
);
export const getNoteById = createAsyncThunk("getNoteById", async (noteId) => {
  try {
    const { data } = await axiosInstance.post("/api/note/get-note/" + noteId);
    return data.data;
  } catch (err) {
    return err.message;
  }
});
export const addNote = createAsyncThunk("addNote", async (data) => {
  try {
    await axiosInstance.post("/api/note/add", data);
    return "Note has been added";
  } catch (err) {
    console.log(err);
    return err.message;
  }
});
export const updateNote = createAsyncThunk("updateNote", async (data) => {
  try {
    await axiosInstance.put("/api/note/update/" + data.id, data.data);
    return "Note has been updated";
  } catch (err) {
    console.log(err);
    return err.message;
  }
});
export const deleteNote = createAsyncThunk("deleteNote", async (id) => {
  try {
    await axiosInstance.delete("/api/note/delete/" + id);
    return "Note has been deleted";
  } catch (err) {
    console.log(err);
    return err.message;
  }
});

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addNote.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(addNote.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(addNote.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    // GET DEAL
    builder.addCase(updateNote.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(updateNote.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(updateNote.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    // GET DEAL
    builder.addCase(deleteNote.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(deleteNote.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(deleteNote.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    // GET DEAL
    builder.addCase(getNotesByCardId.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(getNotesByCardId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.error = null;
    });
    builder.addCase(getNotesByCardId.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    // GET DEAL
    builder.addCase(getNoteById.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(getNoteById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.data = payload;
      state.error = null;
    });
    builder.addCase(getNoteById.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });
  },
});

export default noteSlice.reducer;
