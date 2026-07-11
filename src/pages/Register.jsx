import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerVendor, clearError } from "../Reducer/AuthSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm_password: "", phone: "",
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => { return () => dispatch(clearError()); }, []);

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return;
    if (form.password !== form.confirm_password) return;
    const result = await dispatch(registerVendor(form));
    if (result.meta.requestStatus === "fulfilled") setSuccess(true);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
          <h2 className="auth-title">Registration Successful!</h2>
          <p className="auth-sub" style={{ marginBottom: 24 }}>
            Your pharmacist account has been created. Sign in to continue and register your pharmacy.
          </p>
          <button className="btn btn-primary w-full" style={{ justifyContent: "center" }}
            onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">Q</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#1D9E75" }}>
            QuickMeds Vendor
          </span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Register as a pharmacist on QuickMeds</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" placeholder="Your full name"
            value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input type="email" className="form-input" placeholder="you@pharmacy.com"
            value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input type="tel" className="form-input" placeholder="10-digit mobile number"
            value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input type="password" className="form-input" placeholder="Min 6 characters"
              value={form.password} onChange={(e) => set("password", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <input type="password" className="form-input" placeholder="Repeat password"
              value={form.confirm_password}
              onChange={(e) => set("confirm_password", e.target.value)} />
            {form.confirm_password && form.password !== form.confirm_password && (
              <div className="form-error">Passwords do not match</div>
            )}
          </div>
        </div>

        <button
          className="btn btn-primary w-full"
          onClick={handleSubmit}
          disabled={
            loading || !form.name || !form.email || !form.password ||
            form.password !== form.confirm_password
          }
          style={{ justifyContent: "center", marginTop: 4 }}
        >
          {loading ? <span className="loader loader-sm" /> : "Create Account"}
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;