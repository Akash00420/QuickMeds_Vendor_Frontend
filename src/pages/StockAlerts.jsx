import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLowStockMedicines, getExpiringMedicines } from "../Reducer/MedicineSlice";
import StockUpdateModal from "../components/StockUpdateModal";
import StockBadge from "../components/StockBadge";
import Loader from "../components/Loader";

const StockAlerts = () => {
  const dispatch = useDispatch();
  const { lowStock, expiring, loading } = useSelector((s) => s.medicine);
  const [activeTab, setActiveTab] = useState("low");
  const [stockMed, setStockMed]   = useState(null);
  const [expiryDays, setExpiryDays] = useState(30);

  useEffect(() => {
    dispatch(getLowStockMedicines());
    dispatch(getExpiringMedicines(expiryDays));
  }, [expiryDays]);

  const data = activeTab === "low" ? lowStock : expiring;

  return (
    <div className="vendor-main">
      <div className="page-header">
        <div>
          <div className="page-title">Stock Alerts</div>
          <div className="page-subtitle">
            {lowStock.length} low stock · {expiring.length} expiring soon
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "low" ? "active" : ""}`}
          onClick={() => setActiveTab("low")}
        >
          ⚠️ Low Stock ({lowStock.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "expiring" ? "active" : ""}`}
          onClick={() => setActiveTab("expiring")}
        >
          📅 Expiring Soon ({expiring.length})
        </button>
      </div>

      {activeTab === "expiring" && (
        <div className="filter-bar">
          <label className="form-label" style={{ margin: 0, alignSelf: "center" }}>
            Show expiring within:
          </label>
          <select
            className="form-select"
            style={{ width: "auto" }}
            value={expiryDays}
            onChange={(e) => setExpiryDays(Number(e.target.value))}
          >
            <option value={7}>7 days</option>
            <option value={15}>15 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
      )}

      {loading ? (
        <Loader text="Loading alerts..." />
      ) : data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{activeTab === "low" ? "✅" : "🗓️"}</div>
          <div className="empty-state-title">
            {activeTab === "low"
              ? "All medicines are well-stocked"
              : `No medicines expiring within ${expiryDays} days`}
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Brand</th>
                <th>Stock</th>
                {activeTab === "expiring" && <th>Expiry Date</th>}
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((m) => (
                <tr key={m._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div className="text-sm text-muted">{m.strength}</div>
                  </td>
                  <td>{m.brand || "—"}</td>
                  <td>
                    {m.quantity} {m.unit}
                    {activeTab === "low" && (
                      <div className="text-sm text-muted">
                        Threshold: {m.lowStockThreshold}
                      </div>
                    )}
                  </td>
                  {activeTab === "expiring" && (
                    <td>
                      <span className={
                        new Date(m.expiryDate) < new Date(Date.now() + 7 * 86400000)
                          ? "text-red font-bold"
                          : "text-amber"
                      }>
                        {new Date(m.expiryDate).toLocaleDateString("en-IN")}
                      </span>
                    </td>
                  )}
                  <td>
                    <StockBadge stockStatus={m.stockStatus} />
                  </td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setStockMed(m)}
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default StockAlerts;