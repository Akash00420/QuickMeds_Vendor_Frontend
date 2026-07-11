import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../Reducer/AuthSlice";

const LINKS = [
  { to: "/dashboard",    label: "Dashboard"    },
  { to: "/medicines",    label: "Medicines"    },
  { to: "/reservations", label: "Reservations" },
  { to: "/emergency",    label: "Emergency"    },
  { to: "/stock-alerts", label: "Alerts"       },
];

const Navbar = ({ onNotifOpen }) => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user }   = useSelector((s) => s.auth);
  const { unreadCount } = useSelector((s) => s.notification);
  const { myPharmacy }  = useSelector((s) => s.pharmacy);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "PH";

  return (
    <nav className="vendor-navbar">
      <div className="flex items-center gap-3">
        <div className="navbar-logo">
          <div className="navbar-logo-mark">Q</div>
          <span>QuickMeds</span>
        </div>
        <span className="navbar-badge">Vendor</span>
        {myPharmacy && !myPharmacy.isVerified && (
          <span className="badge badge-amber" style={{ fontSize: 11 }}>
            ⚠️ Pending Verification
          </span>
        )}
      </div>

      <div className="navbar-links">
        {LINKS.map((link) => (
          <button
            key={link.to}
            className={`navbar-link ${location.pathname === link.to ? "active" : ""}`}
            onClick={() => navigate(link.to)}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="navbar-right">
        <button className="notif-btn" onClick={onNotifOpen}>
          🔔
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}
        </button>

        <button
          className="avatar-btn"
          onClick={() => navigate("/profile")}
          title={user?.name || "Profile"}
        >
          {initials}
        </button>

        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;