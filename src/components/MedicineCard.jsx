import StockBadge from "./StockBadge";

const MedicineCard = ({ medicine, onEdit, onUpdateStock, onDelete }) => {
  return (
    <div className="medicine-card">
      <div>
        <div className="medicine-name">{medicine.name}</div>
        <div className="medicine-meta">
          {medicine.brand && <span>{medicine.brand} · </span>}
          {medicine.strength && <span>{medicine.strength} · </span>}
          <span style={{ textTransform: "capitalize" }}>{medicine.dosageForm}</span>
        </div>
      </div>

      <StockBadge
        stockStatus={medicine.stockStatus}
        quantity={medicine.quantity}
        unit={medicine.unit}
      />

      <div className="medicine-footer">
        <div>
          <div className="medicine-price">₹{medicine.sellingPrice}</div>
          {medicine.mrp !== medicine.sellingPrice && (
            <div className="text-muted text-sm" style={{ textDecoration: "line-through" }}>
              ₹{medicine.mrp}
            </div>
          )}
        </div>
        <div className="medicine-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onUpdateStock?.(medicine)}
            title="Update stock"
          >
            📦
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onEdit?.(medicine)}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onDelete?.(medicine._id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {medicine.expiryDate && (
        <div className="text-sm text-muted">
          Exp: {new Date(medicine.expiryDate).toLocaleDateString("en-IN")}
        </div>
      )}
    </div>
  );
};

export default MedicineCard;