import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";

const initialState = {
  data: [],
  loading: false,
  success: false,
  error: null,
};

export const getClients = createAsyncThunk("getClients", async () => {
  try {
    const { data } = await axiosInstance.get("/api/clients/get-clients");
    return data.data;
  } catch (err) {
    console.log(err);
    return err.message;
  }
});
export const createClient = createAsyncThunk(
  "createClient",
  async (clientData) => {
    try {
      const { data } = await axiosInstance.post("/api/client/add", clientData);
      return data.data;
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }
);
export const updateClient = createAsyncThunk("updateClient", async (data) => {
  try {
    await axiosInstance.put("/api/client/update", data);
    return "Deal stage has updated";
  } catch (err) {
    console.log(err);
    return err.message;
  }
});
export const getClientById = createAsyncThunk("getClientById", async (id) => {
  try {
    const res = await axiosInstance.get("/api/client/get-client/" + id);
    return res.data.data;
  } catch (err) {
    console.log(err);
    return err.message;
  }
});
export const deleteClient = createAsyncThunk("deleteClient", async (id) => {
  try {
    await axiosInstance.delete("/api/client/delete", {
      params: {
        id,
      },
    });
    return "Deal has been deleted";
  } catch (err) {
    console.log(err);
    return err.message;
  }
});

const clientSlice = createSlice({
  name: "client",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getClients.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(getClients.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(getClients.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    // CREATE DEAL
    builder.addCase(createClient.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(createClient.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.data = payload;
      state.error = null;
    });
    builder.addCase(createClient.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    // UPDATE DEAL STAGE
    builder.addCase(updateClient.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(updateClient.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(updateClient.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    // GET DEAL
    builder.addCase(getClientById.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(getClientById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.data = payload;
      state.error = null;
    });
    builder.addCase(getClientById.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    // GET DEAL
    builder.addCase(deleteClient.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(deleteClient.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(deleteClient.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });
  },
});

export default clientSlice.reducer;
