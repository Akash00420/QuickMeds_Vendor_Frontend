import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

// =========================
// ✅ ASYNC THUNKS
// =========================
export const loginVendor = createAsyncThunk(
  "auth/loginVendor",
  async (data, { rejectWithValue }) => {
    try {
      const res = await Api.post("/api/logins/create-login", data);
      const { token, user } = res.data;

      if (user.role !== "pharmacist") {
        return rejectWithValue("Access denied. Pharmacist account required.");
      }

      sessionStorage.setItem(
        "quickmeds_vendor_token",
        JSON.stringify({ token, role: user.role })
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const registerVendor = createAsyncThunk(
  "auth/registerVendor",
  async (data, { rejectWithValue }) => {
    try {
      const res = await Api.post("/api/registers/create-register", {
        ...data,
        role: "pharmacist",
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const getVendorProfile = createAsyncThunk(
  "auth/getVendorProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/users/profile");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const updateVendorProfile = createAsyncThunk(
  "auth/updateVendorProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await Api.put("/api/users/profile", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);

// =========================
// ✅ SLICE
// =========================
const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user:            null,
    token:           null,
    isAuthenticated: false,
    loading:         false,
    error:           null,
  },
  reducers: {
    logout: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("quickmeds_vendor_token");
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginVendor.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(loginVendor.fulfilled, (state, action) => {
        state.loading         = false;
        state.token           = action.payload.token;
        state.user            = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginVendor.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    // Register
    builder
      .addCase(registerVendor.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(registerVendor.fulfilled, (state) => { state.loading = false; })
      .addCase(registerVendor.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    // Profile
    builder
      .addCase(getVendorProfile.fulfilled, (state, action) => {
        state.user = action.payload.data?.user;
      });

    builder
      .addCase(updateVendorProfile.fulfilled, (state, action) => {
        state.user = action.payload.data?.user;
      });
  },
});

export const { logout, clearError } = AuthSlice.actions;
export default AuthSlice.reducer;