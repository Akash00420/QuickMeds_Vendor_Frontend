import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPharmacyReservations, setStatusFilter } from "../Reducer/ReservationSlice";
import ReservationCard from "../components/ReservationCard";
import Loader from "../components/Loader";

const STATUSES = ["pending", "confirmed", "ready", "completed", "cancelled"];

const ReservationManager = () => {
  const dispatch = useDispatch();
  const { reservations, statusFilter, loading } = useSelector((s) => s.reservation);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getPharmacyReservations(statusFilter));
  }, [statusFilter]);

  const filtered = reservations.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.user?.name?.toLowerCase().includes(q) ||
      r._id?.toLowerCase().includes(q) ||
      r.items?.some((i) => i.name?.toLowerCase().includes(q))
    );
  });

  return (
    <div className="vendor-main">
      <div className="page-header">
        <div>
          <div className="page-title">Reservations</div>
          <div className="page-subtitle">{reservations.length} {statusFilter} reservations</div>
        </div>
      </div>

      {/* Status filter */}
      <div className="status-pills">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`status-pill ${statusFilter === s ? "active" : ""}`}
            onClick={() => dispatch(setStatusFilter(s))}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search by customer name, medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => dispatch(getPharmacyReservations(statusFilter))}
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <Loader text="Loading reservations..." />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">No {statusFilter} reservations</div>
          <div className="empty-state-sub">
            {search ? "Try a different search term." : "Check back later."}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((r) => (
            <ReservationCard key={r._id} reservation={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationManager;