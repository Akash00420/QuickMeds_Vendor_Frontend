import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyPharmacy,
  registerPharmacy,
  updatePharmacy,
} from "../Reducer/PharmacySlice";
import Loader from "../components/Loader";
import VendorTypeMultiSelect from "../components/VendorTypeMultiSelect";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const DEFAULT_HOURS = DAYS.map((day) => ({
  day, open: "09:00", close: "21:00", isClosed: day === "sun",
}));

const INITIAL = {
  name: "", registrationNumber: "", phone: "", email: "",
  vendorType: [],
  address: { street: "", city: "", state: "", pincode: "" },
  longitude: "", latitude: "",
  isOpen24Hours: false,
  operatingHours: DEFAULT_HOURS,
};

const PharmacyProfile = () => {
  const dispatch = useDispatch();
  const { myPharmacy, loading, error } = useSelector((s) => s.pharmacy);
  const [form, setForm]       = useState(INITIAL);
  const [success, setSuccess] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    dispatch(getMyPharmacy());
  }, []);

  useEffect(() => {
    if (myPharmacy) {
      setForm({
        name:               myPharmacy.name || "",
        registrationNumber: myPharmacy.registrationNumber || "",
        phone:              myPharmacy.phone || "",
        email:              myPharmacy.email || "",
        vendorType:         myPharmacy.vendorType || [],
        address: {
          street:  myPharmacy.address?.street  || "",
          city:    myPharmacy.address?.city    || "",
          state:   myPharmacy.address?.state   || "",
          pincode: myPharmacy.address?.pincode || "",
        },
        longitude:      myPharmacy.location?.coordinates?.[0] || "",
        latitude:       myPharmacy.location?.coordinates?.[1] || "",
        isOpen24Hours:  myPharmacy.isOpen24Hours || false,
        operatingHours: myPharmacy.operatingHours?.length
          ? myPharmacy.operatingHours
          : DEFAULT_HOURS,
      });
    }
  }, [myPharmacy]);

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const setAddr = (field, value) =>
    setForm((p) => ({ ...p, address: { ...p.address, [field]: value } }));

  const useMyLocation = () => {
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set("latitude", pos.coords.latitude.toFixed(6));
        set("longitude", pos.coords.longitude.toFixed(6));
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  };

  const updateHours = (idx, field, value) => {
    const updated = [...form.operatingHours];
    updated[idx] = { ...updated[idx], [field]: value };
    set("operatingHours", updated);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      longitude: Number(form.longitude),
      latitude:  Number(form.latitude),
    };
    let result;
    if (myPharmacy) {
      result = await dispatch(updatePharmacy({ pharmacyId: myPharmacy._id, data: payload }));
    } else {
      result = await dispatch(registerPharmacy(payload));
    }
    if (result.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading && !myPharmacy) return <Loader text="Loading pharmacy profile..." />;

  return (
    <div className="vendor-main">
      <div className="page-header">
        <div>
          <div className="page-title">
            {myPharmacy ? "Pharmacy Profile" : "Register Pharmacy"}
          </div>
          <div className="page-subtitle">
            {myPharmacy
              ? `${myPharmacy.isVerified ? "✅ Verified" : "⏳ Pending verification"}`
              : "Complete the form below to get listed on QuickMeds"}
          </div>
        </div>
        {myPharmacy && (
          <span className={`badge ${myPharmacy.isVerified ? "badge-green" : "badge-amber"}`}>
            {myPharmacy.isVerified ? "Verified" : "Pending Verification"}
          </span>
        )}
      </div>

      {error && <div className="auth-error mb-4">{error}</div>}
      {success && (
        <div className="verified-banner verified mb-4">
          ✅ {myPharmacy ? "Pharmacy updated successfully" : "Pharmacy registered! Awaiting admin verification."}
        </div>
      )}

      <div className="card card-lg">
        {/* Basic Info */}
        <div className="section-title mb-4">Basic Information</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Pharmacy Name *</label>
            <input className="form-input" value={form.name}
              onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Registration Number *</label>
            <input className="form-input" value={form.registrationNumber}
              onChange={(e) => set("registrationNumber", e.target.value)}
              disabled={!!myPharmacy} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input className="form-input" value={form.phone}
              onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={form.email}
              onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Vendor Type * (select all that apply)</label>
            <VendorTypeMultiSelect
              value={form.vendorType}
              onChange={(vals) => set("vendorType", vals)}
            />
          </div>
        </div>

        {/* Address */}
        <div className="section-title mb-4 mt-6">Address</div>
        <div className="form-group">
          <label className="form-label">Street *</label>
          <input className="form-input" value={form.address.street}
            onChange={(e) => setAddr("street", e.target.value)} />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">City *</label>
            <input className="form-input" value={form.address.city}
              onChange={(e) => setAddr("city", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">State *</label>
            <input className="form-input" value={form.address.state}
              onChange={(e) => setAddr("state", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Pincode *</label>
            <input className="form-input" value={form.address.pincode}
              onChange={(e) => setAddr("pincode", e.target.value)} />
          </div>
        </div>

        {/* Location */}
        <div className="section-title mb-4 mt-6">Location Coordinates</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Longitude *</label>
            <input className="form-input" value={form.longitude}
              onChange={(e) => set("longitude", e.target.value)} placeholder="e.g. 88.3639" />
          </div>
          <div className="form-group">
            <label className="form-label">Latitude *</label>
            <input className="form-input" value={form.latitude}
              onChange={(e) => set("latitude", e.target.value)} placeholder="e.g. 22.5726" />
          </div>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={useMyLocation}
          disabled={geoLoading}
        >
          {geoLoading ? <span className="loader loader-sm" /> : "📍 Use My Location"}
        </button>

        {/* Operating Hours */}
        <div className="section-title mb-4 mt-6">Operating Hours</div>
        <div className="form-group">
          <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={form.isOpen24Hours}
              onChange={(e) => set("isOpen24Hours", e.target.checked)} />
            <span className="form-label" style={{ margin: 0 }}>Open 24 Hours</span>
          </label>
        </div>
        {!form.isOpen24Hours && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {form.operatingHours.map((h, i) => (
              <div key={h.day} className="flex items-center gap-3">
                <div style={{ width: 40, textTransform: "capitalize", fontWeight: 600, fontSize: 13 }}>
                  {h.day}
                </div>
                <input type="checkbox" checked={!h.isClosed}
                  onChange={(e) => updateHours(i, "isClosed", !e.target.checked)} />
                <input type="time" className="form-input" style={{ width: 120 }}
                  value={h.open} disabled={h.isClosed}
                  onChange={(e) => updateHours(i, "open", e.target.value)} />
                <span className="text-muted">to</span>
                <input type="time" className="form-input" style={{ width: 120 }}
                  value={h.close} disabled={h.isClosed}
                  onChange={(e) => updateHours(i, "close", e.target.value)} />
                {h.isClosed && <span className="badge badge-gray">Closed</span>}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={loading || !form.name || !form.registrationNumber ||
              !form.phone || !form.longitude || !form.latitude || form.vendorType.length === 0}
          >
            {loading
              ? <span className="loader loader-sm" />
              : myPharmacy ? "Save Changes" : "Register Pharmacy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyProfile;