import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

// =========================
// ✅ ASYNC THUNKS
// =========================
export const getIncomingRequests = createAsyncThunk(
  "emergency/getIncoming",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/emergency/pharmacy/incoming");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch emergency requests");
    }
  }
);

export const respondToRequest = createAsyncThunk(
  "emergency/respond",
  async ({ requestId, response, message }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/api/emergency/${requestId}/respond`, {
        response,
        message,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to respond");
    }
  }
);

export const fulfillRequest = createAsyncThunk(
  "emergency/fulfill",
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/api/emergency/${requestId}/fulfill`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fulfill request");
    }
  }
);

// =========================
// ✅ SLICE
// =========================
const EmergencySlice = createSlice({
  name: "emergency",
  initialState: {
    requests: [],
    loading:  false,
    error:    null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },

    // =========================
    // ✅ LIVE INCOMING REQUEST (from SocketContext on emergency:new_request)
    // =========================
    addLiveRequest: (state, action) => {
      state.requests.unshift({
        ...action.payload,
        isLive: true,  // flag to highlight new live alerts in UI
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIncomingRequests.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(getIncomingRequests.fulfilled, (state, action) => {
        state.loading  = false;
        state.requests = action.payload.data?.requests || [];
      })
      .addCase(getIncomingRequests.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(respondToRequest.fulfilled, (state, action) => {
        const updated = action.payload.data?.request;
        const idx = state.requests.findIndex((r) => r._id === updated._id);
        if (idx !== -1) state.requests[idx] = { ...updated, isLive: false };
      });

    builder
      .addCase(fulfillRequest.fulfilled, (state, action) => {
        const updated = action.payload.data?.request;
        const idx = state.requests.findIndex((r) => r._id === updated._id);
        if (idx !== -1) state.requests[idx] = { ...updated, isLive: false };
      });
  },
});

export const { clearError, addLiveRequest } = EmergencySlice.actions;
export default EmergencySlice.reducer;