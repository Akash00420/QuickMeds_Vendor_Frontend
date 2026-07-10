import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

// =========================
// ✅ ASYNC THUNKS
// =========================
export const getPharmacyReservations = createAsyncThunk(
  "reservation/getAll",
  async (status, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/reservations/pharmacy", {
        params: status ? { status } : {},
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reservations");
    }
  }
);

export const updateReservationStatus = createAsyncThunk(
  "reservation/updateStatus",
  async ({ reservationId, status, pharmacistNote }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/api/reservations/${reservationId}/status`, {
        status,
        pharmacistNote,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update reservation");
    }
  }
);

export const getReservationById = createAsyncThunk(
  "reservation/getById",
  async (reservationId, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/api/reservations/${reservationId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reservation");
    }
  }
);

// =========================
// ✅ SLICE
// =========================
const ReservationSlice = createSlice({
  name: "reservation",
  initialState: {
    reservations: [],
    selected:     null,
    statusFilter: "pending",
    loading:      false,
    error:        null,
  },
  reducers: {
    clearError:       (state) => { state.error = null; },
    setStatusFilter:  (state, action) => { state.statusFilter = action.payload; },
    setSelected:      (state, action) => { state.selected = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPharmacyReservations.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(getPharmacyReservations.fulfilled, (state, action) => {
        state.loading      = false;
        state.reservations = action.payload.data?.reservations || [];
      })
      .addCase(getPharmacyReservations.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(updateReservationStatus.pending,   (state) => { state.loading = true; })
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data?.reservation;
        const idx = state.reservations.findIndex((r) => r._id === updated._id);
        if (idx !== -1) state.reservations[idx] = updated;
      })
      .addCase(updateReservationStatus.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(getReservationById.fulfilled, (state, action) => {
        state.selected = action.payload.data?.reservation;
      });
  },
});

export const { clearError, setStatusFilter, setSelected } = ReservationSlice.actions;
export default ReservationSlice.reducer;