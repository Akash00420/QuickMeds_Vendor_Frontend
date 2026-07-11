import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { respondToRequest, fulfillRequest } from "../Reducer/EmergencySlice";

const URGENCY_BADGE = {
  critical: "badge-red",
  high:     "badge-amber",
  medium:   "badge-blue",
};

const EmergencyAlert = ({ request }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.emergency);
  const [message, setMessage] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleAccept = () => {
    dispatch(respondToRequest({
      requestId: request._id || request.emergencyRequestId,
      response: "accepted",
      message,
    }));
    setShowReply(false);
  };

  const handleReject = () => {
    dispatch(respondToRequest({
      requestId: request._id || request.emergencyRequestId,
      response: "rejected",
      message,
    }));
    setShowReply(false);
  };

  const handleFulfill = () => {
    dispatch(fulfillRequest(request._id || request.emergencyRequestId));
  };

  const isOpen = request.status === "open" || request.isLive;

  return (
    <div className={`emergency-alert ${request.isLive ? "live" : ""}`}>
      <div className="emergency-alert-header">
        <div>
          <div className="emergency-medicine">💊 {request.medicineName}</div>
          <div className="text-sm text-muted mt-2">
            Qty: {request.quantity} units
          </div>
        </div>
        <span className={`badge ${URGENCY_BADGE[request.urgencyLevel] || "badge-gray"}`}>
          {request.urgencyLevel}
        </span>
      </div>

      <div className="emergency-meta">
        {request.contactPhone && (
          <span>📞 {request.contactPhone}</span>
        )}
        {request.address && (
          <span>📍 {request.address}</span>
        )}
        {request.notes && (
          <span>📝 {request.notes}</span>
        )}
        <span>
          🕐 {new Date(request.createdAt).toLocaleString("en-IN")}
        </span>
      </div>

      {showReply && (
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="Optional message to patient..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      )}

      <div className="emergency-actions">
        {isOpen && !showReply && (
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setShowReply(true)}
          >
            Reply
          </button>
        )}
        {isOpen && showReply && (
          <>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleAccept}
              disabled={loading}
            >
              ✓ Accept
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={handleReject}
              disabled={loading}
            >
              ✗ Reject
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setShowReply(false)}
            >
              Cancel
            </button>
          </>
        )}
        {request.status === "responded" && (
          <button
            className="btn btn-sm btn-primary"
            onClick={handleFulfill}
            disabled={loading}
          >
            Mark Fulfilled
          </button>
        )}
        {(request.status === "fulfilled" || request.status === "cancelled") && (
          <span className={`badge ${request.status === "fulfilled" ? "badge-green" : "badge-gray"}`}>
            {request.status}
          </span>
        )}
      </div>
    </div>
  );
};

export default EmergencyAlert;