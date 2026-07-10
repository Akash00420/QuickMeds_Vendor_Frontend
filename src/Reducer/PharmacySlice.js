import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

// =========================
// ✅ ASYNC THUNKS
// =========================
export const getMyPharmacy = createAsyncThunk(
  "pharmacy/getMyPharmacy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/pharmacies/me/profile");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch pharmacy");
    }
  }
);

export const registerPharmacy = createAsyncThunk(
  "pharmacy/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await Api.post("/api/pharmacies", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to register pharmacy");
    }
  }
);

export const updatePharmacy = createAsyncThunk(
  "pharmacy/update",
  async ({ pharmacyId, data }, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/api/pharmacies/${pharmacyId}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update pharmacy");
    }
  }
);

export const uploadPharmacyImages = createAsyncThunk(
  "pharmacy/uploadImages",
  async ({ pharmacyId, formData }, { rejectWithValue }) => {
    try {
      const res = await Api.post(`/api/pharmacies/${pharmacyId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to upload images");
    }
  }
);

export const uploadLicenseDocument = createAsyncThunk(
  "pharmacy/uploadLicense",
  async ({ pharmacyId, formData }, { rejectWithValue }) => {
    try {
      const res = await Api.post(`/api/pharmacies/${pharmacyId}/license`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to upload license");
    }
  }
);

// =========================
// ✅ SLICE
// =========================
const PharmacySlice = createSlice({
  name: "pharmacy",
  initialState: {
    myPharmacy: null,
    loading:    false,
    error:      null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyPharmacy.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(getMyPharmacy.fulfilled, (state, action) => {
        state.loading    = false;
        state.myPharmacy = action.payload.data?.pharmacy;
      })
      .addCase(getMyPharmacy.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(registerPharmacy.fulfilled, (state, action) => {
        state.myPharmacy = action.payload.data?.pharmacy;
      });

    builder
      .addCase(updatePharmacy.fulfilled, (state, action) => {
        state.myPharmacy = action.payload.data?.pharmacy;
      });

    builder
      .addCase(uploadPharmacyImages.fulfilled, (state, action) => {
        if (state.myPharmacy) {
          state.myPharmacy.images = action.payload.data?.images;
        }
      });

    builder
      .addCase(uploadLicenseDocument.fulfilled, (state, action) => {
        if (state.myPharmacy) {
          state.myPharmacy.licenseDocument = action.payload.data?.pharmacy?.licenseDocument;
          state.myPharmacy.isVerified      = false;
        }
      });
  },
});

export const { clearError } = PharmacySlice.actions;
export default PharmacySlice.reducer;