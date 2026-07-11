import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// ── Pages ─────────────────────────────────────────────────────────────────────
import Login               from "./pages/Login";
import Register            from "./pages/Register";
import Dashboard           from "./pages/Dashboard";
import MedicineManager     from "./pages/MedicineManager";
import ReservationManager  from "./pages/ReservationManager";
import EmergencyIncoming   from "./pages/EmergencyIncoming";
import StockAlerts         from "./pages/StockAlerts";
import PharmacyProfile     from "./pages/PharmacyProfile";
import Notifications       from "./pages/Notifications";
import NotFound            from "./pages/NotFound";

// ── Components ────────────────────────────────────────────────────────────────
import Navbar              from "./components/Navbar";
import NotifyPanel         from "./components/NotifyPanel";

// ── Redux ─────────────────────────────────────────────────────────────────────
import { getMyNotifications } from "./Reducer/NotificationSlice";

// =========================
// ✅ PROTECTED ROUTE (pharmacist only)
// =========================
const ProtectedRoute = ({ children }) => {
  const stored = sessionStorage.getItem("quickmeds_vendor_token");
  const parsed = stored ? JSON.parse(stored) : null;
  if (!parsed?.token)               return <Navigate to="/login" replace />;
  if (parsed.role !== "pharmacist") return <Navigate to="/login" replace />;
  return children;
};

// =========================
// ✅ APP LAYOUT
// =========================
const AppLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [notifOpen, setNotifOpen] = useState(false);
  const { notifications } = useSelector((s) => s.notification);

  const hideNavbarRoutes = ["/login", "/register"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  const handleNotifOpen = () => {
    dispatch(getMyNotifications());
    setNotifOpen(true);
  };

  return (
    <>
      {!hideNavbar && (
        <Navbar onNotifOpen={handleNotifOpen} />
      )}

      <NotifyPanel
        notifications={notifications}
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />

      <Routes>
        {/* ── Public ──────────────────────────────────────── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Redirect root → dashboard ───────────────────── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ── Protected (pharmacist) ──────────────────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/medicines" element={
          <ProtectedRoute><MedicineManager /></ProtectedRoute>
        } />
        <Route path="/reservations" element={
          <ProtectedRoute><ReservationManager /></ProtectedRoute>
        } />
        <Route path="/emergency" element={
          <ProtectedRoute><EmergencyIncoming /></ProtectedRoute>
        } />
        <Route path="/stock-alerts" element={
          <ProtectedRoute><StockAlerts /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><PharmacyProfile /></ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute><Notifications /></ProtectedRoute>
        } />

        {/* ── 404 ─────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// =========================
// ✅ APP ROOT
// =========================
function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;