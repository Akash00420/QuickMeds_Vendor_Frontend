import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

// =========================
// ✅ ASYNC THUNKS
// =========================
export const getPharmacyMedicines = createAsyncThunk(
  "medicine/getAll",
  async (pharmacyId, { rejectWithValue }) => {
    try {
      const res = await Api.get(`/api/pharmacies/${pharmacyId}/medicines`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch medicines");
    }
  }
);

export const addMedicine = createAsyncThunk(
  "medicine/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await Api.post("/api/medicines", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add medicine");
    }
  }
);

export const bulkAddMedicines = createAsyncThunk(
  "medicine/bulkAdd",
  async (medicines, { rejectWithValue }) => {
    try {
      const res = await Api.post("/api/medicines/bulk", { medicines });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to import medicines");
    }
  }
);

export const updateMedicine = createAsyncThunk(
  "medicine/update",
  async ({ medicineId, data }, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/api/medicines/${medicineId}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update medicine");
    }
  }
);

export const updateStock = createAsyncThunk(
  "medicine/updateStock",
  async ({ medicineId, quantity }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/api/medicines/${medicineId}/stock`, { quantity });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update stock");
    }
  }
);

export const deleteMedicine = createAsyncThunk(
  "medicine/delete",
  async (medicineId, { rejectWithValue }) => {
    try {
      await Api.delete(`/api/medicines/${medicineId}`);
      return medicineId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete medicine");
    }
  }
);

export const getLowStockMedicines = createAsyncThunk(
  "medicine/lowStock",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/medicines/low-stock");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch low stock");
    }
  }
);

export const getExpiringMedicines = createAsyncThunk(
  "medicine/expiring",
  async (days = 30, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/medicines/expiring", { params: { days } });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch expiring medicines");
    }
  }
);

export const uploadMedicineImage = createAsyncThunk(
  "medicine/uploadImage",
  async ({ medicineId, formData }, { rejectWithValue }) => {
    try {
      const res = await Api.post(`/api/medicines/${medicineId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to upload image");
    }
  }
);

// =========================
// ✅ SLICE
// =========================
const MedicineSlice = createSlice({
  name: "medicine",
  initialState: {
    medicines:  [],
    lowStock:   [],
    expiring:   [],
    selected:   null,
    loading:    false,
    error:      null,
  },
  reducers: {
    clearError:  (state) => { state.error = null; },
    setSelected: (state, action) => { state.selected = action.payload; },

    // =========================
    // ✅ LIVE STOCK UPDATE (from SocketContext on stock:updated)
    // =========================
    updateStockLive: (state, action) => {
      const { medicineId, quantity, stockStatus } = action.payload;
      const idx = state.medicines.findIndex((m) => m._id === medicineId);
      if (idx !== -1) {
        state.medicines[idx].quantity    = quantity;
        state.medicines[idx].stockStatus = stockStatus;
      }
      const lowIdx = state.lowStock.findIndex((m) => m._id === medicineId);
      if (lowIdx !== -1) {
        state.lowStock[lowIdx].quantity = quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPharmacyMedicines.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(getPharmacyMedicines.fulfilled, (state, action) => {
        state.loading   = false;
        state.medicines = action.payload.data?.medicines || [];
      })
      .addCase(getPharmacyMedicines.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(addMedicine.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(addMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines.unshift(action.payload.data?.medicine);
      })
      .addCase(addMedicine.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(bulkAddMedicines.fulfilled, (state) => { state.loading = false; });

    builder
      .addCase(updateMedicine.fulfilled, (state, action) => {
        const updated = action.payload.data?.medicine;
        const idx = state.medicines.findIndex((m) => m._id === updated._id);
        if (idx !== -1) state.medicines[idx] = updated;
      });

    builder
      .addCase(updateStock.fulfilled, (state, action) => {
        const updated = action.payload.data?.medicine;
        const idx = state.medicines.findIndex((m) => m._id === updated._id);
        if (idx !== -1) state.medicines[idx] = updated;
      });

    builder
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.medicines = state.medicines.filter((m) => m._id !== action.payload);
        state.lowStock  = state.lowStock.filter((m) => m._id !== action.payload);
      });

    builder
      .addCase(getLowStockMedicines.fulfilled, (state, action) => {
        state.lowStock = action.payload.data?.medicines || [];
      });

    builder
      .addCase(getExpiringMedicines.fulfilled, (state, action) => {
        state.expiring = action.payload.data?.medicines || [];
      });

    builder
      .addCase(uploadMedicineImage.fulfilled, (state, action) => {
        const updated = action.payload.data?.medicine;
        const idx = state.medicines.findIndex((m) => m._id === updated._id);
        if (idx !== -1) state.medicines[idx] = updated;
      });
  },
});

export const { clearError, setSelected, updateStockLive } = MedicineSlice.actions;
export default MedicineSlice.reducer;