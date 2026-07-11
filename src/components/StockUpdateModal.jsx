import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStock } from "../Reducer/MedicineSlice";

const StockUpdateModal = ({ medicine, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.medicine);
  const [quantity, setQuantity] = useState(medicine.quantity || 0);

  const handleSubmit = async () => {
    if (quantity < 0) return;
    await dispatch(updateStock({ medicineId: medicine._id, quantity: Number(quantity) }));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Update Stock</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="stock-modal-current">
          <span className="stock-modal-label">{medicine.name} · {medicine.strength}</span>
          <span className="stock-modal-value">{medicine.quantity} {medicine.unit}</span>
        </div>

        <div className="form-group">
          <label className="form-label">New Quantity ({medicine.unit})</label>
          <input
            type="number"
            className="form-input"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            autoFocus
          />
          {quantity < medicine.lowStockThreshold && quantity > 0 && (
            <div className="form-error">
              ⚠️ Below low stock threshold ({medicine.lowStockThreshold})
            </div>
          )}
          {Number(quantity) === 0 && (
            <div className="form-error">⚠️ Setting to 0 will mark as out of stock</div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || quantity < 0}
          >
            {loading ? <span className="loader loader-sm" /> : "Update Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockUpdateModal;