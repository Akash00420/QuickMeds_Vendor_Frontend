import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPharmacyMedicines,
  deleteMedicine,
  updateMedicine,
} from "../Reducer/MedicineSlice";
import { getMyPharmacy } from "../Reducer/PharmacySlice";
import MedicineCard from "../components/MedicineCard";
import AddMedicineForm from "../components/AddMedicineForm";
import StockUpdateModal from "../components/StockUpdateModal";
import Loader from "../components/Loader";

const MedicineManager = () => {
  const dispatch = useDispatch();
  const { myPharmacy } = useSelector((s) => s.pharmacy);
  const { medicines, loading } = useSelector((s) => s.medicine);

  const [search, setSearch]           = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [stockMed, setStockMed]       = useState(null);   // medicine to update stock
  const [editMed, setEditMed]         = useState(null);   // medicine to edit (future use)
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    if (!myPharmacy) dispatch(getMyPharmacy());
  }, []);

  useEffect(() => {
    if (myPharmacy?._id) dispatch(getPharmacyMedicines(myPharmacy._id));
  }, [myPharmacy]);

  const handleDelete = async (medicineId) => {
    if (!window.confirm("Delete this medicine? This cannot be undone.")) return;
    dispatch(deleteMedicine(medicineId));
  };

  const categories = ["all", ...new Set(medicines.map((m) => m.category).filter(Boolean))];

  const filtered = medicines.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.brand?.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || m.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="vendor-main">
      <div className="page-header">
        <div>
          <div className="page-title">Medicine Inventory</div>
          <div className="page-subtitle">
            {medicines.length} medicines · {medicines.filter((m) => m.isAvailable).length} available
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          + Add Medicine
        </button>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search by name, brand, generic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ width: "auto", minWidth: 140 }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Stock status tabs */}
      <div className="status-pills">
        {["all", "available", "low", "out_of_stock"].map((s) => {
          const count = s === "all"
            ? filtered.length
            : filtered.filter((m) => m.stockStatus === s).length;
          return (
            <button
              key={s}
              className="status-pill"
              style={{ opacity: count === 0 && s !== "all" ? 0.5 : 1 }}
            >
              {s === "all" ? "All" : s === "out_of_stock" ? "Out of Stock" : s.charAt(0).toUpperCase() + s.slice(1)}
              {" "}({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <Loader text="Loading medicines..." />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💊</div>
          <div className="empty-state-title">
            {search ? "No medicines match your search" : "No medicines yet"}
          </div>
          <div className="empty-state-sub">
            {!search && "Add your first medicine to get started."}
          </div>
          {!search && (
            <button className="btn btn-primary mt-4" onClick={() => setShowAddForm(true)}>
              + Add Medicine
            </button>
          )}
        </div>
      ) : (
        <div className="medicine-grid">
          {filtered.map((m) => (
            <MedicineCard
              key={m._id}
              medicine={m}
              onUpdateStock={(med) => setStockMed(med)}
              onEdit={(med) => setEditMed(med)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddForm && (
        <AddMedicineForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => myPharmacy && dispatch(getPharmacyMedicines(myPharmacy._id))}
        />
      )}
      {stockMed && (
        <StockUpdateModal
          medicine={stockMed}
          onClose={() => setStockMed(null)}
        />
      )}
    </div>
  );
};

export default MedicineManager;