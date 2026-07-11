import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyPharmacy } from "../Reducer/PharmacySlice";
import { getLowStockMedicines, getPharmacyMedicines } from "../Reducer/MedicineSlice";
import { getPharmacyReservations } from "../Reducer/ReservationSlice";
import { getIncomingRequests } from "../Reducer/EmergencySlice";
import { getMyNotifications } from "../Reducer/NotificationSlice";
import Loader from "../components/Loader";
import ReservationCard from "../components/ReservationCard";
import EmergencyAlert from "../components/EmergencyAlert";

const Dashboard = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((s) => s.auth);
  const { myPharmacy, loading: pharmLoading } = useSelector((s) => s.pharmacy);
  const { medicines, lowStock } = useSelector((s) => s.medicine);
  const { reservations }        = useSelector((s) => s.reservation);
  const { requests }            = useSelector((s) => s.emergency);
  const { unreadCount }         = useSelector((s) => s.notification);

  useEffect(() => {
    dispatch(getMyPharmacy());
    dispatch(getPharmacyReservations("pending"));
    dispatch(getIncomingRequests());
    dispatch(getMyNotifications());
  }, []);

  useEffect(() => {
    if (myPharmacy?._id) {
      dispatch(getPharmacyMedicines(myPharmacy._id));
      dispatch(getLowStockMedicines());
    }
  }, [myPharmacy]);

  if (pharmLoading) return <Loader text="Loading dashboard..." />;

  const pendingReservations = reservations.filter((r) => r.status === "pending");
  const openEmergencies     = requests.filter((r) => r.status === "open" || r.isLive);

  return (
    <div className="vendor-main">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <h1>Hello, <span>{user?.name?.split(" ")[0] || "Pharmacist"}</span> 👋</h1>
        <p className="page-subtitle">
          {myPharmacy ? myPharmacy.name : "Register your pharmacy to get started"}
        </p>
      </div>

      {/* Verification banner */}
      {myPharmacy && !myPharmacy.isVerified && (
        <div className="verified-banner unverified">
          ⏳ Your pharmacy is pending admin verification. You won't appear in search results until approved.
        </div>
      )}
      {myPharmacy?.isVerified && (
        <div className="verified-banner verified">
          ✅ Pharmacy verified — you're live on QuickMeds
        </div>
      )}

      {/* No pharmacy yet */}
      {!myPharmacy && (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏥</div>
          <h3 style={{ marginBottom: 8 }}>Register Your Pharmacy</h3>
          <p className="text-muted" style={{ marginBottom: 20 }}>
            Add your pharmacy details to start receiving reservations and emergency requests.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/profile")}>
            Register Pharmacy
          </button>
        </div>
      )}

      {myPharmacy && (
        <>
          {/* Stat cards */}
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon icon-teal">💊</div>
              <div className="stat-label">Total Medicines</div>
              <div className="stat-value">{medicines.length}</div>
              <div className="stat-sub">{myPharmacy.medicineCount || 0} in inventory</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-amber">⚠️</div>
              <div className="stat-label">Low Stock</div>
              <div className="stat-value">{lowStock.length}</div>
              <div className="stat-sub">Need restocking</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-blue">📋</div>
              <div className="stat-label">Pending Orders</div>
              <div className="stat-value">{pendingReservations.length}</div>
              <div className="stat-sub">Awaiting confirmation</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-red">🚨</div>
              <div className="stat-label">Emergency Requests</div>
              <div className="stat-value">{openEmergencies.length}</div>
              <div className="stat-sub">Open near you</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-purple">🔔</div>
              <div className="stat-label">Unread Notifications</div>
              <div className="stat-value">{unreadCount}</div>
              <div className="stat-sub">New updates</div>
            </div>
          </div>

          {/* Pending Reservations + Emergency side by side */}
          <div className="dashboard-grid">
            <div>
              <div className="section-header">
                <div className="section-title">Pending Reservations</div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate("/reservations")}>
                  View all →
                </button>
              </div>
              {pendingReservations.length === 0 ? (
                <div className="card">
                  <div className="empty-state" style={{ padding: "24px" }}>
                    <div className="empty-state-icon">📋</div>
                    <div className="empty-state-title">No pending reservations</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {pendingReservations.slice(0, 3).map((r) => (
                    <ReservationCard key={r._id} reservation={r} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="section-header">
                <div className="section-title">Emergency Requests</div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate("/emergency")}>
                  View all →
                </button>
              </div>
              {openEmergencies.length === 0 ? (
                <div className="card">
                  <div className="empty-state" style={{ padding: "24px" }}>
                    <div className="empty-state-icon">🚨</div>
                    <div className="empty-state-title">No open requests</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {openEmergencies.slice(0, 3).map((r) => (
                    <EmergencyAlert key={r._id || r.emergencyRequestId} request={r} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;