import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIncomingRequests } from "../Reducer/EmergencySlice";
import EmergencyAlert from "../components/EmergencyAlert";
import Loader from "../components/Loader";

const EmergencyIncoming = () => {
  const dispatch = useDispatch();
  const { requests, loading } = useSelector((s) => s.emergency);

  useEffect(() => {
    dispatch(getIncomingRequests());
  }, []);

  const live       = requests.filter((r) => r.isLive);
  const open       = requests.filter((r) => (r.status === "open" || r.status === "responded") && !r.isLive);
  const completed  = requests.filter((r) => r.status === "fulfilled" || r.status === "cancelled");

  return (
    <div className="vendor-main">
      <div className="page-header">
        <div>
          <div className="page-title">Emergency Requests</div>
          <div className="page-subtitle">
            {requests.filter((r) => r.status === "open" || r.isLive).length} open ·{" "}
            {requests.length} total
          </div>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => dispatch(getIncomingRequests())}
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <Loader text="Loading emergency requests..." />
      ) : (
        <>
          {/* Live alerts (came in via socket) */}
          {live.length > 0 && (
            <>
              <div className="section-header">
                <div className="section-title text-red">
                  🚨 Live Alerts ({live.length})
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {live.map((r) => (
                  <EmergencyAlert key={r._id || r.emergencyRequestId} request={r} />
                ))}
              </div>
            </>
          )}

          {/* Open requests */}
          {open.length > 0 && (
            <>
              <div className="section-header">
                <div className="section-title">Open Requests ({open.length})</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {open.map((r) => (
                  <EmergencyAlert key={r._id} request={r} />
                ))}
              </div>
            </>
          )}

          {/* Completed / cancelled */}
          {completed.length > 0 && (
            <>
              <div className="section-header mt-4">
                <div className="section-title text-muted">Past Requests</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {completed.map((r) => (
                  <EmergencyAlert key={r._id} request={r} />
                ))}
              </div>
            </>
          )}

          {requests.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🚨</div>
              <div className="empty-state-title">No emergency requests</div>
              <div className="empty-state-sub">
                New requests nearby will appear here in real time.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmergencyIncoming;