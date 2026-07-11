import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMedicine } from "../Reducer/MedicineSlice";

const CATEGORIES = [
  "antibiotic","analgesic","antihistamine","antiviral","antifungal",
  "cardiovascular","diabetes","gastrointestinal","respiratory",
  "vitamin","supplement","topical","ophthalmic","other",
];

const DOSAGE_FORMS = ["tablet","capsule","syrup","injection","cream","drops","inhaler","patch","other"];

const INITIAL = {
  name: "", genericName: "", brand: "", category: "other",
  dosageForm: "tablet", strength: "", manufacturer: "",
  quantity: "", unit: "strips", lowStockThreshold: 5,
  mrp: "", sellingPrice: "", requiresPrescription: false,
  batchNumber: "",
};

const AddMedicineForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.medicine);
  const [form, setForm] = useState(INITIAL);

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.mrp || !form.sellingPrice || !form.quantity) return;
    const result = await dispatch(addMedicine(form));
    if (result.meta.requestStatus === "fulfilled") {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Add Medicine</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* Identity */}
        <div className="form-grid mb-4">
          <div className="form-group">
            <label className="form-label">Medicine Name *</label>
            <input className="form-input" value={form.name}
              onChange={(e) => set("name", e.target.value)} placeholder="e.g. Paracetamol" />
          </div>
          <div className="form-group">
            <label className="form-label">Generic Name</label>
            <input className="form-input" value={form.genericName}
              onChange={(e) => set("genericName", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Brand</label>
            <input className="form-input" value={form.brand}
              onChange={(e) => set("brand", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Strength</label>
            <input className="form-input" value={form.strength}
              onChange={(e) => set("strength", e.target.value)} placeholder="e.g. 500mg" />
          </div>
        </div>

        <div className="form-grid mb-4">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category}
              onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Dosage Form</label>
            <select className="form-select" value={form.dosageForm}
              onChange={(e) => set("dosageForm", e.target.value)}>
              {DOSAGE_FORMS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock */}
        <div className="form-grid-3 mb-4">
          <div className="form-group">
            <label className="form-label">Quantity *</label>
            <input type="number" className="form-input" value={form.quantity} min="0"
              onChange={(e) => set("quantity", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Unit</label>
            <select className="form-select" value={form.unit}
              onChange={(e) => set("unit", e.target.value)}>
              {["strips","bottles","vials","tubes","units"].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Low Stock Alert At</label>
            <input type="number" className="form-input" value={form.lowStockThreshold} min="1"
              onChange={(e) => set("lowStockThreshold", e.target.value)} />
          </div>
        </div>

        {/* Pricing */}
        <div className="form-grid mb-4">
          <div className="form-group">
            <label className="form-label">MRP (₹) *</label>
            <input type="number" className="form-input" value={form.mrp} min="0"
              onChange={(e) => set("mrp", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Selling Price (₹) *</label>
            <input type="number" className="form-input" value={form.sellingPrice} min="0"
              onChange={(e) => set("sellingPrice", e.target.value)} />
          </div>
        </div>

        {/* Misc */}
        <div className="form-grid mb-4">
          <div className="form-group">
            <label className="form-label">Batch Number</label>
            <input className="form-input" value={form.batchNumber}
              onChange={(e) => set("batchNumber", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Manufacturer</label>
            <input className="form-input" value={form.manufacturer}
              onChange={(e) => set("manufacturer", e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={form.requiresPrescription}
              onChange={(e) => set("requiresPrescription", e.target.checked)} />
            <span className="form-label" style={{ margin: 0 }}>Requires Prescription</span>
          </label>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || !form.name || !form.mrp || !form.sellingPrice || !form.quantity}
          >
            {loading ? <span className="loader loader-sm" /> : "Add Medicine"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMedicineForm;