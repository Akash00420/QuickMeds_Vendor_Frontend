import { useDispatch, useSelector } from "react-redux";
import { updateReservationStatus } from "../Reducer/ReservationSlice";

const STATUS_FLOW = {
  pending:   { next: "confirmed", label: "Confirm",  cls: "btn-primary" },
  confirmed: { next: "ready",     label: "Mark Ready", cls: "btn-amber" },
  ready:     { next: "completed", label: "Complete",  cls: "btn-primary" },
};

const ReservationCard = ({ reservation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.reservation);

  const handleStatusUpdate = (nextStatus) => {
    dispatch(updateReservationStatus({
      reservationId: reservation._id,
      status: nextStatus,
    }));
  };

  const statusBadge = {
    pending:   "badge-amber",
    confirmed: "badge-blue",
    ready:     "badge-purple",
    completed: "badge-green",
    cancelled: "badge-red",
    expired:   "badge-gray",
  };

  return (
    <div className="reservation-card">
      <div className="reservation-header">
        <div>
          <div className="reservation-user">
            {reservation.user?.name || "Customer"}
          </div>
          <div className="reservation-id">
            #{reservation._id?.slice(-8).toUpperCase()}
          </div>
        </div>
        <span className={`badge ${statusBadge[reservation.status]}`}>
          {reservation.status}
        </span>
      </div>

      <div className="reservation-items">
        {reservation.items?.map((item, i) => (
          <div key={i}>
            {item.name} × {item.quantity}
          </div>
        ))}
      </div>

      {reservation.notes && (
        <div className="text-sm text-muted mb-4">Note: {reservation.notes}</div>
      )}

      <div className="reservation-footer">
        <div className="reservation-amount">₹{reservation.totalAmount}</div>
        <div className="flex gap-2">
          {STATUS_FLOW[reservation.status] && (
            <button
              className={`btn btn-sm ${STATUS_FLOW[reservation.status].cls}`}
              onClick={() => handleStatusUpdate(STATUS_FLOW[reservation.status].next)}
              disabled={loading}
            >
              {STATUS_FLOW[reservation.status].label}
            </button>
          )}
          {reservation.status === "pending" && (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleStatusUpdate("cancelled")}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;