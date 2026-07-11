import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
} from "../Reducer/NotificationSlice";
import Loader from "../components/Loader";

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const TYPE_ICON = {
  reservation_confirmed:      "📋",
  reservation_ready:          "✅",
  reservation_completed:      "🎉",
  reservation_cancelled:      "❌",
  reservation_expiring_soon:  "⏰",
  emergency_request_received: "🚨",
  low_stock_alert:            "⚠️",
  out_of_stock_alert:         "🔴",
  restock_recommendation:     "📦",
  outbreak_alert:             "🧪",
  pharmacy_approved:          "✅",
  pharmacy_rejected:          "❌",
  system:                     "🔔",
};

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector((s) => s.notification);

  useEffect(() => {
    dispatch(getMyNotifications());
  }, []);

  return (
    <div className="vendor-main">
      <div className="page-header">
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-subtitle">{unreadCount} unread</div>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button className="btn btn-outline btn-sm" onClick={() => dispatch(markAllAsRead())}>
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={() => dispatch(clearAllNotifications())}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <Loader text="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔔</div>
          <div className="empty-state-title">No notifications yet</div>
          <div className="empty-state-sub">
            Stock alerts, reservation updates, and emergency requests will appear here.
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {notifications.map((n, i) => (
            <div
              key={n._id}
              className={`notif-item ${!n.isRead ? "unread" : ""}`}
              style={{
                borderBottom: i < notifications.length - 1 ? "1px solid #F1F5F9" : "none",
                padding: "16px 20px",
              }}
              onClick={() => !n.isRead && dispatch(markAsRead(n._id))}
            >
              <div style={{ fontSize: 22, flexShrink: 0 }}>
                {TYPE_ICON[n.type] || "🔔"}
              </div>
              <div className="notif-content">
                <div className="notif-title">{n.title}</div>
                <div className="notif-msg">{n.message}</div>
                <div className="notif-time">{timeAgo(n.createdAt)}</div>
              </div>
              {!n.isRead && <div className="notif-dot" style={{ flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;