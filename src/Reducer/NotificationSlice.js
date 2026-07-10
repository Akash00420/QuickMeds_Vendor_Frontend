import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

// =========================
// ✅ ASYNC THUNKS
// =========================
export const getMyNotifications = createAsyncThunk(
  "notification/getMine",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/notifications", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notification/markRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/api/notifications/${notificationId}/read`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark as read");
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notification/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await Api.patch("/api/notifications/read-all");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark all as read");
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  "notification/clearAll",
  async (_, { rejectWithValue }) => {
    try {
      await Api.delete("/api/notifications/clear-all");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to clear notifications");
    }
  }
);

// =========================
// ✅ SLICE
// =========================
const NotificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount:   0,
    loading:       false,
    error:         null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },

    // =========================
    // ✅ LIVE NOTIFICATION (from SocketContext)
    // =========================
    addLiveNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyNotifications.pending,   (state) => { state.loading = true; })
      .addCase(getMyNotifications.fulfilled, (state, action) => {
        state.loading       = false;
        state.notifications = action.payload.data?.notifications || [];
        state.unreadCount   = action.payload.data?.unreadCount   || 0;
      })
      .addCase(getMyNotifications.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const updated = action.payload.data?.notification;
        const idx = state.notifications.findIndex((n) => n._id === updated._id);
        if (idx !== -1) {
          state.notifications[idx] = updated;
          if (state.unreadCount > 0) state.unreadCount -= 1;
        }
      });

    builder
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
        state.unreadCount   = 0;
      });

    builder
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount   = 0;
      });
  },
});

export const { clearError, addLiveNotification } = NotificationSlice.actions;
export default NotificationSlice.reducer;