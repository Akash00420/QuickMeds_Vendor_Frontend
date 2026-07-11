import { useDispatch, useSelector } from "react-redux";
import { markAsRead, markAllAsRead, clearAllNotifications } from "../Reducer/NotificationSlice";

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const NotifyPanel = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((s) => s.notification);

  if (!open) return null;

  return (
    <>
      <div className="notif-overlay" onClick={onClose} />
      <div className="notif-panel">
        <div className="notif-panel-header">
          <div className="notif-panel-title">
            Notifications
            {unreadCount > 0 && (
              <span className="badge badge-green" style={{ marginLeft: 8 }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => dispatch(markAllAsRead())}
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                className="btn btn-ghost btn-sm text-red"
                onClick={() => dispatch(clearAllNotifications())}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="notif-empty">
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔔</div>
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notif-item ${!n.isRead ? "unread" : ""}`}
                onClick={() => !n.isRead && dispatch(markAsRead(n._id))}
              >
                {!n.isRead && <div className="notif-dot" />}
                <div className="notif-content">
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-msg">{n.message}</div>
                  <div className="notif-time">{timeAgo(n.createdAt)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotifyPanel;